import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://agencia-dk.github.io/mi-app-daniel'),
  title: 'Daniel OS — Panel personal',
  description: 'Panel gamificado de progreso, hábitos y objetivos personales.',
  openGraph: {
    title: 'Daniel OS',
    description: 'Convierte tu progreso en experiencia.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daniel OS',
    description: 'Convierte tu progreso en experiencia.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
