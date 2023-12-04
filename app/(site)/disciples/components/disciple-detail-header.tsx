import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import { getDiscipleById } from "../service/disciples"

async function DiscipleDetailHeader({ discipleId }: { discipleId: string }) {
  const disciple = await getDiscipleById(discipleId)

  if (!disciple) return notFound()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <Link
            href="/disciples"
            className="inline-flex items-center gap-3 font-medium hover:underline"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to </span>
            <span>Disciples</span>
          </Link>
          <PageTitle title={disciple.name} />
          <span className="flex items-center gap-2 text-muted-foreground">
            ID:{" "}
            <Badge variant="secondary" className="inline rounded">
              {disciple.id}
            </Badge>
          </span>
        </div>
        <div>
          <Link
            href={`/disciples/edit/${disciple.id}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Edit2 className="mr-3 h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>
    </>
  )
}

export default DiscipleDetailHeader
