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
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent position="left" className="w-[80%]">
        <nav className="h-full w-full text-muted-foreground">
          <div className="flex h-16 items-center gap-3">
            <Image
              src="/gcc-app-logo.png"
              alt="gcc system"
              width={48}
              height={48}
            />
            <span className="text-xl font-semibold text-white">GCC System</span>
          </div>
          <div className="space-y-2">
            <p className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            <ul className="space-y-1">
              {menuItems.map((navItem) => (
                <li key={navItem.title} onClick={() => setOpen(false)}>
                  <NavLink href={navItem.href}>
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
