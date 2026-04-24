import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const ALLOWED_USERNAME = process.env.ALLOWED_GITHUB_USERNAME ?? 'samsiva-dev'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return (profile as { login?: string })?.login === ALLOWED_USERNAME
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}
