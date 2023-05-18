import "next-auth/jwt"
import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    id: string
    discipleId?: string
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role: Role
      id: string
      discipleId?: string
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    id: string
    discipleId?: string
  }
}
