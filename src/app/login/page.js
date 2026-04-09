'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>StreamVault</h1>
          <p>Sign in to your account</p>
        </div>

        <form action={action}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
            {state?.errors?.email && (
              <p className="form-error">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            {state?.errors?.password && (
              <p className="form-error">{state.errors.password[0]}</p>
            )}
          </div>

          <button className="auth-btn" type="submit" disabled={pending}>
            {pending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
