import { Role } from "@prisma/client"
import { DefaultSession } from "next-auth"

import "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    id: string
    discipleId?: string
    isPrimary?: boolean
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role: Role
      id: string
      discipleId?: string
      isPrimary?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    id: string
    discipleId?: string
    isPrimary?: boolean
  }
}
