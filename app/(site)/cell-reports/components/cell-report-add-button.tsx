import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function CellReportAddButton() {
  return (
    <Link href="/cell-reports/new" className={cn(buttonVariants())}>
      <Plus className="mr-3 h-4 w-4" />
      <span>Create</span>
    </Link>
  )
}

export default CellReportAddButton
