"use client"

import { useState } from "react"
import { MenuIcon } from "lucide-react"

import { menuItems } from "@/config/menuItems"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import NavLink from "./nav-link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="open menu">
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle className="text-base">GCC Admin</SheetTitle>
        </SheetHeader>
        <nav className="px-2 py-4" onClick={() => setOpen(false)}>
          <ul className="space-y-1">
            {menuItems.map((navItem) => (
              <li key={navItem.title}>
                <NavLink href={navItem.href} forMobile>
                  <span className="mr-3">{navItem.icon}</span>
                  <span>{navItem.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
