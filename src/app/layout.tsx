import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FocusFlow - Gestión de Tareas ADHD-friendly',
  description: 'Sistema de gestión de tareas diseñado para personas con TDAH. Interfaz limpia, colores suaves y organización visual efectiva.',
  keywords: ['TDAH', 'productividad', 'gestión de tareas', 'kanban', 'focus'],
  authors: [{ name: 'FocusFlow' }],
  openGraph: {
    title: 'FocusFlow - Gestión de Tareas',
    description: 'Gestión de tareas ADHD-friendly',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
