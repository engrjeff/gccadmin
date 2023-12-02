import SideNav from "@/components/side-nav"
import { SiteHeader } from "@/components/site-header"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <div className="flex flex-1 flex-col lg:max-w-[calc(100vw-220px)]">
        <SiteHeader />
        <main className="container h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden py-6">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default SiteLayout
