"use client"

import { LogOutIcon, MoreVerticalIcon, UserIcon } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Skeleton } from "./ui/skeleton"

export function UserMenuDropdown() {
  const session = useSession()

  if (session.status === "loading")
    return (
      <div className="flex items-center gap-2 rounded-md border px-4 py-3">
        <Skeleton className="size-7 animate-pulse rounded-full bg-muted" />
        <Skeleton className="h-4 flex-1 animate-pulse rounded bg-muted" />
      </div>
    )

  if (!session.data?.user) {
    return null
  }

  const user = session.data.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-auto w-full justify-start py-3 text-left"
        >
          <Avatar key={user.image} className="h-7 w-7">
            <AvatarImage
              src={user.image || undefined}
              className="object-cover"
            />
            {user.name && (
              <AvatarFallback className="bg-primary text-white">
                {user.name.substring(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <p className="text-xs text-foreground">{user.name}</p>
          <MoreVerticalIcon className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-trigger-width">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="flex w-full">
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="flex w-full"
            onClick={() => signOut()}
          >
            <LogOutIcon className="mr-2 size-4" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function UserMobileMenuDropdown() {
  const session = useSession()

  if (session.status === "loading")
    return (
      <Skeleton className="size-6 animate-pulse rounded-full border bg-muted" />
    )

  if (!session.data?.user) {
    return null
  }

  const user = session.data.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-6 rounded-full">
          <Avatar key={user.image} className="size-full">
            <AvatarImage
              src={user.image || undefined}
              className="object-cover"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className="flex w-full">
            <UserIcon className="mr-2 size-4" />
            <span>Profile</span>
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            type="button"
            className="flex w-full"
            onClick={() => signOut()}
          >
            <LogOutIcon className="mr-2 size-4" />
            <span>Log out</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
