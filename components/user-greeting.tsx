"use client"

import { useSession } from "next-auth/react"

import { Skeleton } from "./ui/skeleton"

function UserGreeting() {
  const session = useSession()

  if (session.status === "loading")
    return <Skeleton className="h-7 w-[200px]" />

  return (
    <div>
      <p className="font-semibold lg:text-xl">
        Hi, {session.data?.user?.name}!
      </p>
    </div>
  )
}

export default UserGreeting
