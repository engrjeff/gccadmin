import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function DiscipleAddButton({ leaderId }: { leaderId?: string }) {
  return (
    <Link
      href={{ pathname: "/disciples/new", query: { leaderId } }}
      className={cn(buttonVariants())}
    >
      <Plus className="mr-3 h-4 w-4" />
      <span>Add</span>
    </Link>
  )
}

export default DiscipleAddButton
