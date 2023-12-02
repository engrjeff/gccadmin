import Image from "next/image"

import { menuItems } from "@/config/menuItems"

import NavLink from "./nav-link"

function SideNav() {
  return (
    <nav className="hidden min-h-screen w-[220px] shrink-0 border-r bg-muted text-muted-foreground lg:block">
      <div className="flex h-16 items-center gap-3 px-4 pt-4">
        <Image
          src="/gcc-app-logo.png"
          alt="gcc system"
          width={48}
          height={48}
        />
        <span className="text-xl font-semibold">GCC System</span>
      </div>
      <div className="space-y-2 p-4">
        <p className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((navItem) => (
            <li key={navItem.title}>
              <NavLink href={navItem.href}>
                <span className="mr-3">{navItem.icon}</span>
                <span>{navItem.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default SideNav
