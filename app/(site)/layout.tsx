import SideNav from "@/components/side-nav"
import { SiteHeader } from "@/components/site-header"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-h-screen overflow-hidden">
      <SideNav />
      <div className="flex flex-1 flex-col">
        <SiteHeader />
        <div className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden bg-muted p-4">
          <div className="h-full rounded-lg bg-background p-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default SiteLayout
