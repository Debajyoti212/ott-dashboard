import './globals.css';

export const metadata = {
  title: 'StreamVault — Multi-OTT Analytics Platform',
  description: 'Aggregate Netflix, Amazon Prime, and Jio Hotstar content with powerful analytics dashboards.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
