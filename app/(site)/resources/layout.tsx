import { type ReactNode } from "react"

function ResourcesLayout({ children }: { children: ReactNode }) {
  return <div className="h-full overflow-y-auto">{children}</div>
}

export default ResourcesLayout
