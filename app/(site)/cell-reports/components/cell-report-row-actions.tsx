import Link from "next/link"
import { Edit } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function CellReportRowActions({ cellReportId }: { cellReportId: string }) {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/cell-reports/edit/${cellReportId}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="sr-only">Edit</span>
              <Edit className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>Edit Cell Report</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default CellReportRowActions
