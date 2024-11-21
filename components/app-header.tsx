import { AppQuickActions } from "./app-quick-actions"
import { MobileNav } from "./mobile-nav"
import { UserMobileMenuDropdown } from "./user-menu-dropdown"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between border-b bg-background/60 px-2 backdrop-blur-lg lg:hidden">
      <div className="grow-0">
        <AppQuickActions />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <UserMobileMenuDropdown />
        <MobileNav />
      </div>
    </header>
  )
}
