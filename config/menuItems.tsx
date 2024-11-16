import {
  FlameIcon,
  LayoutDashboard,
  Library,
  ListTodoIcon,
  StickyNote,
  Table2Icon,
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
]

export const processMenuItems = [
  {
    title: "Encounter",
    href: "/encounter",
    icon: <FlameIcon className="h-4 w-4" />,
  },
  {
    title: "Tracking",
    href: "/tracking",
    icon: <Table2Icon className="h-4 w-4" />,
  },
  {
    title: "Process Attendance",
    href: "/process-attendance",
    icon: <ListTodoIcon className="h-4 w-4" />,
  },
]
