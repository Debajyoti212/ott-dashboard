'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import getDb from '@/app/lib/db';
import { createSession, deleteSession } from '@/app/lib/session';

export async function signup(prevState, formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  // Validate
  const errors = {};
  if (!name || name.length < 2) errors.name = ['Name must be at least 2 characters'];
  if (!email || !email.includes('@')) errors.email = ['Please enter a valid email'];
  if (!password || password.length < 6) errors.password = ['Password must be at least 6 characters'];

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const db = getDb();

  // Check if user exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return { errors: { email: ['An account with this email already exists'] } };
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
  ).run(name, email, passwordHash);

  await createSession(result.lastInsertRowid, name);
  redirect('/select-platform');
}

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Validate
  const errors = {};
  if (!email) errors.email = ['Email is required'];
  if (!password) errors.password = ['Password is required'];

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user) {
    return { errors: { email: ['No account found with this email'] } };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return { errors: { password: ['Incorrect password'] } };
  }

  await createSession(user.id, user.name);
  redirect('/select-platform');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
