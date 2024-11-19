import { Metadata } from "next"
import { ProcessLessonsView } from "@/features/process-lessons/process-lessons-view"

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

export const metadata: Metadata = {
  title: "GCC Process Lessons (Leadership)",
}

async function ProcessLessonsPage() {
  const resources = await prisma.processLessonSeries.findMany({
    include: {
      lessons: true,
    },
  })

  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-4 pb-0">
          <PageTitle
            title="Process Lessons"
            subtitle="View and manage GCC Leadership Lessons."
          />
        </div>
        <div className="w-full flex-1 overflow-y-auto p-4 pt-0">
          <ul className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
            {resources.map((series) => (
              <li key={series.id} className="relative">
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
                    <ProcessLessonsView series={series} />
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

export default ProcessLessonsPage
