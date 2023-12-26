import SideNav from "@/components/side-nav"
import { SiteHeader } from "@/components/site-header"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideNav />
      <div className="h-full overflow-hidden lg:pl-[220px]">
        <SiteHeader />
        <main className="container relative flex h-[calc(100%-64px)] max-h-[calc(100%-64px)] flex-col p-4 lg:p-6">
          {children}
        </main>
      </div>
    </>
  )
}

export default SiteLayout
