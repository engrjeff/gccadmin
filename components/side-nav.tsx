import { menuItems, processMenuItems } from "@/config/menuItems"

import { AppQuickActions } from "./app-quick-actions"
import NavLink from "./nav-link"
import { UserMenuDropdown } from "./user-menu-dropdown"

function SideNav() {
  return (
    <nav className="fixed hidden h-full w-[220px] flex-col bg-background text-muted-foreground lg:flex">
      <div className="p-4">
        <AppQuickActions />
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
        <p className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Process
        </p>
        <ul className="space-y-1">
          {processMenuItems.map((navItem) => (
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
