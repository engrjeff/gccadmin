"use client"

import { type ComponentProps } from "react"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

interface NavLinkProps extends ComponentProps<typeof Link> {
  forMobile?: boolean
}

function NavLink({ className, forMobile, ...props }: NavLinkProps) {
  const segment = useSelectedLayoutSegment()

  const isActive = props.href === `/${segment}`

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({
          size: forMobile ? "default" : "sm",
          variant: isActive && !forMobile ? "default" : "ghost",
        }),
        "w-full justify-start",
        forMobile && isActive ? "text-primary hover:text-primary" : "",
        className
      )}
    />
  )
}

export default NavLink
