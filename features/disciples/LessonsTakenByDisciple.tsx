"use client"

import { format } from "date-fns"
import { Loader2Icon } from "lucide-react"

import { useLessonsTakenByDisciple } from "@/hooks/use-lessons-taken-by-disciple"

export function LessonsTakenByDisciple({ discipleId }: { discipleId: string }) {
  const lessonsTaken = useLessonsTakenByDisciple(discipleId)

  if (lessonsTaken.isLoading)
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Loader2Icon size={32} className="animate-spin" />
        <p>Getting data...</p>
      </div>
    )

  const count = lessonsTaken.data?.length

  if (!count)
    return (
      <div className="flex h-28 items-center justify-center px-4 py-3">
        <p className="w-2/3 text-center text-muted-foreground">
          No lessons taken yet. Make sure that this disciple is attending a cell
          group.
        </p>
      </div>
    )

  return (
    <ul className="divide-y">
      {lessonsTaken.data?.map((cg, index) => (
        <li key={`lesson-taken-${cg.lesson_id}-${index}`}>
          <div className="flex items-start gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">{index + 1}</span>
            <div>
              <h3 className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
                {cg.lesson?.title}
              </h3>
              <span className="text-sm text-muted-foreground">
                Taken on {format(new Date(cg.assignedAt), "MMMM dd, yyyy")}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
