import Logo from "./logo"
import { MobileNav } from "./mobile-nav"
import { UserMobileMenuDropdown } from "./user-menu-dropdown"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background/60 px-4 backdrop-blur-lg lg:hidden">
      <div className="flex items-center gap-2">
        <Logo size={32} />
        <span className="mt-0.5 inline-block font-semibold">GCC Admin</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <UserMobileMenuDropdown />
        <MobileNav />
      </div>
    </header>
  )
}
