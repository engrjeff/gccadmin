import { Metadata } from "next"

import { prisma } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import PageTitle from "@/components/page-title"

import LessonSeriesActions from "./components/lesson-series-actions"
import { LessonsViewModal } from "./components/lessons-view-modal"
import SeriesAddForm from "./components/series-add-form"

export const metadata: Metadata = {
  title: "Resources",
}

async function ResourcesPage() {
  const resources = await prisma.lessonSeries.findMany({
    include: {
      lessons: true,
    },
  })

  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-start justify-between gap-4">
          <PageTitle
            title="Resources"
            subtitle="View and manage GCC Lessons."
          />
          <SeriesAddForm />
        </div>
        <div className="flex-1">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map((series) => (
              <li key={series.id} className="relative">
                <div className="absolute right-1 top-1">
                  <LessonSeriesActions series={series} />
                </div>
                <Card className="flex h-full flex-col">
                  <CardHeader className="lg:p-4">
                    <CardTitle>{series.title}</CardTitle>
                    <div>
                      {series.lessons.length ? (
                        <Badge variant="ACTIVE">
                          {series.lessons.length}{" "}
                          {series.lessons.length > 1 ? "lessons" : "lesson"}
                        </Badge>
                      ) : (
                        <Badge variant="INACTIVE">No lessons yet.</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between lg:p-4 lg:pt-0">
                    <p className="text-sm text-muted-foreground">
                      {series.description ??
                        "Collection of lessons for " + series.title}
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto p-4 pt-0 ">
                    <LessonsViewModal series={series} />
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ResourcesPage
