import Link from "next/link"
import { Edit } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

function CellReportRowActions({ cellReportId }: { cellReportId: string }) {
  return (
    <div>
      <Link
        href={`/cell-reports/edit/${cellReportId}`}
        className={buttonVariants({ size: "icon", variant: "ghost" })}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <span className="sr-only">Edit</span>
        <Edit className="h-4 w-4" />
      </Link>
    </div>
  )
}

export default CellReportRowActions
