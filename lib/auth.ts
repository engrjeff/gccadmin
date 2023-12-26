import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      })

      const discipleUser = await prisma.disciple.findFirst({
        where: {
          userAccountId: dbUser?.id,
        },
      })

      if (dbUser) {
        token.id = dbUser.id
        token.role = dbUser.role!
      }

      if (discipleUser) {
        token.discipleId = discipleUser?.id
        token.isPrimary = discipleUser?.isPrimary
      }

      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
        session.user.discipleId = token.discipleId
        session.user.isPrimary = token.isPrimary
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
