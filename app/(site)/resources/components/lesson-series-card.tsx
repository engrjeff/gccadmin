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

import LessonSeriesActions from "./lesson-series-actions"

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
      {isAdmin ? (
        <div className="absolute right-2 top-2">
          <LessonSeriesActions series={seriesItem} />
        </div>
      ) : null}
      <Card
        data-lessons-shown={searchParams.get("seriesId") === seriesItem.id}
        className="cursor-pointer xl:hover:bg-muted2 xl:data-[lessons-shown=true]:bg-muted2"
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
            {seriesItem.lessons.length}{" "}
            {seriesItem.lessons.length > 1 ? "Lessons" : "Lesson"}
          </p>
        </CardHeader>
      </Card>
      {lessonsShown ? (
        <div className="mt-4 rounded-lg bg-card xl:hidden">
          <div className="p-4">
            <h3 className="text-sm font-semibold">{seriesItem.title}</h3>
            <h4 className="text-sm font-semibold leading-none tracking-tight text-muted-foreground">
              {seriesItem.lessons.length > 1 ? "Lessons" : "Lesson"} (
              {seriesItem.lessons.length})
            </h4>
          </div>
          <div className="max-h-[400px] overflow-y-auto px-4 pb-4">
            <ul className="space-y-2.5">
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
        </div>
      ) : null}
    </div>
  )
}

export default LessonSeriesCard
