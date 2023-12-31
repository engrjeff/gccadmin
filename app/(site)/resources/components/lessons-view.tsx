"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { XIcon } from "lucide-react"

import { useSelectedSeries } from "@/hooks/use-selected-series"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function LessonsView() {
  const searchParams = useSearchParams()
  const lessonSeries = useSelectedSeries(searchParams.get("seriesId"))

  const router = useRouter()

  if (!searchParams.has("seriesId")) return null

  if (lessonSeries.isLoading)
    return (
      <Card className="w-[400px]">
        <Skeleton className="h-full w-full" />
      </Card>
    )

  if (!lessonSeries.data) return null

  const series = lessonSeries.data

  return (
    <Card className="relative hidden w-[400px] xl:block">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2"
        onClick={() => router.push("/resources")}
      >
        <span className="sr-only">close</span>
        <XIcon className="h-4 w-4" />
      </Button>
      <CardHeader>
        <CardTitle>{series.title}</CardTitle>
        <CardDescription>{series.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="mb-4 text-sm font-semibold leading-none tracking-tight">
          {series.lessons.length > 1 ? "Lessons" : "Lesson"} (
          {series.lessons.length})
        </h4>
        <ul className="space-y-2.5 pr-2">
          {series.lessons.map((lesson) => (
            <li key={`lesson-${lesson.id}`}>
              <Card className="rounded bg-muted2 p-3">
                <h5 className="text-sm font-medium leading-none tracking-tight">
                  {lesson.title}
                </h5>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default LessonsView
