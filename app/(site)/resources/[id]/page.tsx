import Link from "next/link"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import { getSeriesById } from "../service"

async function SeriesDetailPage({ params }: { params: { id: string } }) {
  const lessonSeries = await getSeriesById(params.id)

  if (!lessonSeries) return <p>Not found...</p>

  return (
    <>
      <div className="flex justify-between">
        <PageTitle
          title={lessonSeries.title}
          subtitle={lessonSeries.description!}
        />
        <Link href="/resources" className="hover:underline">
          Back to List
        </Link>
      </div>
      <h3 className="text-lg font-semibold">Lessons</h3>
      <ul>
        <li className="py-4">
          <div className="grid grid-cols-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="mr-2">#</span> Title
            </p>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Scriptures
            </p>
          </div>
        </li>
        {lessonSeries.lessons.map((lesson, index) => (
          <li key={lesson.id} className="border-t py-3">
            <div className="grid grid-cols-3">
              <p className="text-sm">
                <span className="mr-2 text-xs text-muted-foreground">
                  {index + 1}
                </span>{" "}
                {lesson.title}
              </p>
              <p className="text-sm">
                {lesson.scripture_references.join(", ")}
              </p>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default SeriesDetailPage
