"use client"

import Link from "next/link"
import { useParams, useSelectedLayoutSegment } from "next/navigation"

import { usePrimaryLeaders } from "@/hooks/use-primary-leaders"
import { buttonVariants } from "@/components/ui/button"

function DiscipleDetailsTabs() {
  const params = useParams<{ id: string }>()
  const segment = useSelectedLayoutSegment()
  const primaryLeaders = usePrimaryLeaders()

  const isPrimary = primaryLeaders.data?.find((d) => d.id === params?.id)
    ? true
    : false

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
      {isPrimary ? (
        <Link
          href={`/disciples/${params.id}/disciple-list`}
          className={buttonVariants({
            variant: segment === "disciple-list" ? "secondary" : "ghost",
            size: "sm",
          })}
        >
          Disciples
        </Link>
      ) : null}
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
