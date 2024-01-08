import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function CellReportAddButton() {
  return (
    <Link
      href="/cell-reports/new"
      className={cn(
        buttonVariants(),
        "fixed bottom-4 right-4 z-30 flex h-14 w-14 rounded-full p-0 shadow-lg lg:static lg:h-10 lg:w-auto lg:rounded-md lg:px-4 lg:py-2"
      )}
    >
      <Plus className="h-6 w-6 lg:mr-3 lg:h-4 lg:w-4" />
      <span className="sr-only lg:not-sr-only">Create</span>
    </Link>
  )
}

export default CellReportAddButton
