"use client"

import { useSession } from "next-auth/react"

function UserGreeting() {
  const session = useSession()

  if (session.status === "loading") return null

  return (
    <div>
      <p className="text-xl font-semibold">Hi, {session.data?.user?.name}!</p>
    </div>
  )
}

export default UserGreeting
