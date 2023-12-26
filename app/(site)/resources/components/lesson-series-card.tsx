"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Lesson, LessonSeries } from "@prisma/client"
import { BookmarkFilledIcon, StackIcon } from "@radix-ui/react-icons"

import { useIsAdmin } from "@/hooks/use-isadmin"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import LessonForm from "./lesson-form"

type SeriesWithLessons = LessonSeries & { lessons: Lesson[] }

function LessonSeriesCard({ seriesItem }: { seriesItem: SeriesWithLessons }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [lessonsShown, setLessonsShown] = useState(false)
  const { isAdmin } = useIsAdmin()

  const changeQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams)

    params.set("seriesId", seriesItem.id)

    router.push(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams, seriesItem.id])

  return (
    <div className="relative">
      {isAdmin ? <LessonForm series={seriesItem} /> : null}
      <Card
        className="cursor-pointer lg:hover:bg-muted2"
        onClick={(e) => {
          e.stopPropagation()
          changeQueryParams()

          setLessonsShown((shown) => !shown)
        }}
      >
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            <BookmarkFilledIcon className="h-4 w-4 text-purple-600" />{" "}
            {seriesItem.title}
          </CardTitle>
          <CardDescription>{seriesItem.description}</CardDescription>
          <p className="flex items-center text-xs">
            <StackIcon
              className="mr-2 h-4 w-4 text-purple-600"
              aria-hidden="true"
            />
            {seriesItem.lessons.length} Lessons
          </p>
          {lessonsShown ? (
            <div className="mt-4 border-t pt-4 xl:hidden">
              <h4 className="mb-4 text-sm font-semibold leading-none tracking-tight">
                Lessons ({seriesItem.lessons.length})
              </h4>
              <ul className="max-h-[400px] space-y-2.5 overflow-y-auto">
                {seriesItem.lessons.map((lesson) => (
                  <li key={`lesson-${lesson.id}`}>
                    <Card className="rounded bg-muted2 p-3">
                      <h5 className="text-sm font-medium leading-none tracking-tight">
                        {lesson.title}
                      </h5>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardHeader>
      </Card>
    </div>
  )
}

export default LessonSeriesCard
