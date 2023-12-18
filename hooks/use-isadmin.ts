"use client"

import { useSession } from "next-auth/react"

export function useIsAdmin() {
  const session = useSession()

  const isAdmin = session.data?.user.role === "ADMIN"

  return isAdmin
}
