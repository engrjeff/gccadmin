import {
  LayoutDashboard,
  Library,
  StickyNote,
  TableProperties,
  Users,
} from "lucide-react"

export const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Disciples",
    href: "/disciples",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Cell Reports",
    href: "/cell-reports",
    icon: <StickyNote className="h-4 w-4" />,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: <Library className="h-4 w-4" />,
  },
  {
    title: "Process",
    href: "/process",
    icon: <TableProperties className="h-4 w-4" />,
  },
]
