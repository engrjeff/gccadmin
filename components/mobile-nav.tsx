"use client"

import { useState } from "react"
import { MenuIcon } from "lucide-react"

import { menuItems } from "@/config/menuItems"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Logo from "./logo"
import NavLink from "./nav-link"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="[&_svg]:size-6"
          variant="ghost"
          aria-label="open menu"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle className="flex items-center gap-3 text-base">
            <Logo size={24} />{" "}
            <span className="mt-0.5 inline-block font-semibold">GCC Admin</span>
          </SheetTitle>
        </SheetHeader>
        <nav className="px-2 py-4" onClick={() => setOpen(false)}>
          <SheetDescription className="mb-3 px-4 text-xs font-medium">
            Menu
          </SheetDescription>
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
