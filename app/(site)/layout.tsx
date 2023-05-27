import SideNav from "@/components/side-nav"
import { SiteHeader } from "@/components/site-header"

async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <div className="flex flex-1 flex-col lg:max-w-[calc(100vw-260px)]">
        <SiteHeader />
        <div className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden bg-muted lg:p-4">
          <div className="h-full bg-background p-4 lg:rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteLayout
