import { ThemeToggle } from "@/components/theme-toggle"
import UserMenu from "@/components/user-menu"

import UserGreeting from "./user-greeting"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center space-x-4 pl-4 pr-8 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-between space-x-4">
          <UserGreeting />
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
