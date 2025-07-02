import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Header from "@/components/commons/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "PET CENTER",
  description: "The best place to take care of your pets",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="es">
        <body className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
