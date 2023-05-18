import { type ReactNode } from "react"

function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full overflow-y-auto px-6">{children}</div>
}

export default ResourcesLayout
