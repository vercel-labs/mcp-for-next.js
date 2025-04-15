import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MCP for Next.js',
  description: 'Model Context Protocol implementation for Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}