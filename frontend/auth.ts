import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function getDjangoTokens(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) return null
  return res.json() as Promise<{
    access: string
    refresh: string
    user: { id: number; email: string; username: string }
  }>
}

async function refreshDjangoToken(refreshToken: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })
  if (!res.ok) return null
  return res.json() as Promise<{ access: string; refresh?: string }>
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(1) })
          .safeParse(credentials)
        if (!parsed.success) return null

        const tokens = await getDjangoTokens(parsed.data.email, parsed.data.password)
        if (!tokens) return null

        return {
          id: String(tokens.user.id),
          email: tokens.user.email,
          name: tokens.user.username,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken
        token.refreshToken = (user as any).refreshToken
        token.accessTokenExpiry = Date.now() + 55 * 60 * 1000 // 55 min
      }

      if (Date.now() < (token.accessTokenExpiry as number)) {
        return token
      }

      const refreshed = await refreshDjangoToken(token.refreshToken as string)
      if (!refreshed) {
        return { ...token, error: 'RefreshAccessTokenError' }
      }

      return {
        ...token,
        accessToken: refreshed.access,
        refreshToken: refreshed.refresh ?? token.refreshToken,
        accessTokenExpiry: Date.now() + 55 * 60 * 1000,
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.error = token.error as string | undefined
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
