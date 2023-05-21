import Image from "next/image"

import { siteConfig } from "@/config/site"

import NavLink from "./nav-link"

function SideNav() {
  return (
    <nav className="min-h-screen w-[260px] border-r border-muted bg-sidenav text-white">
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
        <p className="py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <ul className="space-y-1">
          {siteConfig.mainNav.map((navItem) => (
            <li key={navItem.title}>
              <NavLink href={navItem.href}>{navItem.title}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default SideNav
