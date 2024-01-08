"use client"

import { type ComponentProps } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  const segment = useSelectedLayoutSegment()

  const isActive = props.href === `/${segment}`

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "ghost" }),
        "h-12 w-full justify-start",
        className
      )}
    />
  )
}

export default NavLink
