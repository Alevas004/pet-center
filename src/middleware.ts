import { NextResponse } from 'next/server'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const protectedRoutes = ['/profile', '/pets', '/appointment']
  const publicRoutes = ['/login', '/register']

  const currentPath = req.nextUrl.pathname

  const isProtected = protectedRoutes.includes(currentPath)
  const isPublic = publicRoutes.includes(currentPath)

  const isAuthenticated = !!req.auth

  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)']
}
