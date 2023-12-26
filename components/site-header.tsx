import { ThemeToggle } from "@/components/theme-toggle"
import UserMenu from "@/components/user-menu"

import MobileMenu from "./mobile-menu"
import QuickActions from "./quick-actions"
import UserGreeting from "./user-greeting"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between space-x-4">
        <div className="block lg:hidden">
          <MobileMenu />
        </div>
        <div className="hidden lg:block">
          <UserGreeting />
        </div>
        <div className="ml-auto flex items-center space-x-5">
          <ThemeToggle />
          <QuickActions />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
