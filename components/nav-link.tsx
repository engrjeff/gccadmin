"use client"

import { type ReactNode } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function NavLink(props: { href: string; children: ReactNode }) {
  const segment = useSelectedLayoutSegment()

  const isActive = props.href === `/${segment}`

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost" }),
        "w-full justify-start"
      )}
    />
  )
}

export default NavLink
