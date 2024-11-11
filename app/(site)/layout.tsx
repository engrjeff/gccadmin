import { redirect } from "next/navigation"

import { verifyUser } from "@/lib/session"
import { AppHeader } from "@/components/app-header"
import SideNav from "@/components/side-nav"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  const isUserVerified = await verifyUser()

  if (!isUserVerified) {
    redirect("/unassigned")
  }

  return (
    <>
      <SideNav />
      <div
        vaul-drawer-wrapper=""
        className="h-full lg:overflow-hidden lg:p-4 lg:pl-[220px]"
      >
        <AppHeader />
        <main className="h-full border-gray-900 lg:grid lg:grid-rows-1 lg:rounded-xl lg:border lg:px-0">
          {children}
        </main>
      </div>
    </>
  )
}

export default SiteLayout
