import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import Header from '@/components/commons/header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clinica Veterinaria',
  description: 'Aplicación para la gestión de una clínica veterinaria'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout ({ children }: Readonly<RootLayoutProps>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang='es'>
        <body className='flex min-h-screen flex-col'>
          <Header />
          <main className='flex-1'>
            {children}
          </main>
        </body>
      </html>
    </SessionProvider>
  )
}
