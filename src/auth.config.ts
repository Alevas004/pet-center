import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getUserByEmail } from '@/queries/user'

export default {
  providers: [
    Credentials({
      async authorize (credentials: any) {
        const user = await getUserByEmail(credentials?.email)
        return {
          id: user?.id,
          email: user?.email
        }
      }
    })
  ],
  callbacks: {
    async signIn () {
      return true
    },
    async jwt ({ token, user }) {
      if (!token.sub) return token

      if (user) {
        token.sub = user.id
        token.email = user?.email
      }

      return token
    },
    async session ({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (session.user) {
        session.user.email = token.email as string
      }

      return session
    }
  }
} satisfies NextAuthConfig