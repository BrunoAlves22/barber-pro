import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barber Pro",
  description: "Barber Pro SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-zinc-900">{children}</body>
    </html>
  );
}
