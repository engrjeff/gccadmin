import { menuItems } from "@/config/menuItems"

import Logo from "./logo"
import NavLink from "./nav-link"
import { UserMenuDropdown } from "./user-menu-dropdown"

function SideNav() {
  return (
    <nav className="fixed hidden h-full w-[220px] flex-col bg-background text-muted-foreground lg:flex">
      <div className="flex h-16 items-center gap-3 px-4 pt-4">
        <Logo size={36} />
        <span className="text-xl font-semibold text-white">GCC System</span>
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

      <div className="mt-auto p-4">
        <UserMenuDropdown />
      </div>
    </nav>
  )
}

export default SideNav
