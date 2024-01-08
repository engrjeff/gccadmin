"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"

import { menuItems } from "@/config/menuItems"

import NavLink from "./nav-link"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <span className="sr-only">Menu</span>
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        position="left"
        className="w-2/3 border-y-0 border-l-0 border-r p-0"
      >
        <nav className="h-full w-full text-muted-foreground">
          <div className="flex h-16 items-center gap-3 border-b px-2">
            <Image
              src="/gcc-logo.svg"
              alt="gcc system"
              width={36}
              height={36}
            />
            <span className="text-xl font-bold uppercase text-white">
              GCC System
            </span>
          </div>
          <div className="space-y-2">
            <p className="px-2 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <ul className="space-y-1 pr-6">
              {menuItems.map((navItem) => (
                <li key={navItem.title} onClick={() => setOpen(false)}>
                  <NavLink
                    href={navItem.href}
                    className="rounded-l-none rounded-r-full"
                  >
                    <span className="mr-3">{navItem.icon}</span>
                    <span>{navItem.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export default MobileMenu
