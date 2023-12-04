"use client"

import Link from "next/link"
import { useParams, useSelectedLayoutSegment } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"

function DiscipleDetailsTabs() {
  const params = useParams<{ id: string }>()
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex gap-2 border-b py-2">
      <Link
        href={`/disciples/${params.id}`}
        className={buttonVariants({
          variant: !segment ? "secondary" : "ghost",
          size: "sm",
        })}
      >
        Details
      </Link>
      <Link
        href={`/disciples/${params.id}/lessons`}
        className={buttonVariants({
          variant: segment === "lessons" ? "secondary" : "ghost",
          size: "sm",
        })}
      >
        Lessons Taken
      </Link>
      <Link
        href={`/disciples/${params.id}/cell-groups`}
        className={buttonVariants({
          variant: segment === "cell-groups" ? "secondary" : "ghost",
          size: "sm",
        })}
      >
        Cell Groups
      </Link>
    </div>
  )
}

export default DiscipleDetailsTabs
