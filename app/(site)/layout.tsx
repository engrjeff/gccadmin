import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import SideNav from "@/components/side-nav"
import { SiteHeader } from "@/components/site-header"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user?.discipleId) redirect("/unassigned")

  return (
    <>
      <SideNav />
      <div className="h-full overflow-hidden lg:pl-[220px]">
        <SiteHeader />
        <main className="container relative flex h-[calc(100%-64px)] max-h-[calc(100%-64px)] flex-col px-0 py-4 lg:py-6">
          {children}
        </main>
      </div>
    </>
  )
}

export default SiteLayout
