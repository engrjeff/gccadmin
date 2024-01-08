"use client"

import { usePathname } from "next/navigation"

const pathnameTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/disciples": "Disciples",
  "/disciples/new": "Add Disciple",
  "/disciples/edit": "Edit Disciple",
  "/cell-reports": "Cell Reports",
  "/cell-reports/new": "Create Cell Report",
  "/resources": "Resources",
  "/cell-groups": "Cell Groups",
}

function HeaderTitle() {
  const pathname = usePathname()

  const pathToTake = pathname.split("/").slice(0, 3).join("/")

  const title = pathnameTitleMap[pathToTake]

  if (!title) return null

  return (
    <div className="absolute left-16 top-1/2 block -translate-y-1/2 lg:hidden">
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  )
}

export default HeaderTitle
