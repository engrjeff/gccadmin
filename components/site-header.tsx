import { ThemeToggle } from "@/components/theme-toggle"
import UserMenu from "@/components/user-menu"

import QuickActions from "./quick-actions"
import UserGreeting from "./user-greeting"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4">
        <UserGreeting />
        <div className="flex items-center space-x-5">
          <ThemeToggle />
          <QuickActions />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
