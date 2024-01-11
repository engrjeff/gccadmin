import React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function BottomsheetLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "flex w-full items-center gap-4 rounded-full px-1.5 py-1 text-sm hover:bg-white/5 focus:bg-muted focus-visible:bg-muted active:bg-muted",
        className
      )}
      {...props}
    />
  )
}

export function BottomsheetLinkIcon({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted shadow">
      {children}
    </span>
  )
}
