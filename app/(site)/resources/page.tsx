import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import PageTitle from "@/components/page-title"

import LessonForm from "./components/lesson-form"
import LessonSeriesCard from "./components/lesson-series-card"
import { getLessonSeries } from "./service"

async function ResourcesPage() {
  const lessonSeriesList = await getLessonSeries()

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageTitle title="Lessons" subtitle="GCC Resources for cell groups" />
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Series
        </Button>
      </div>
      <ul className="grid grid-cols-4 gap-6">
        {lessonSeriesList.map((lessonSeries) => (
          <LessonSeriesCard key={lessonSeries.id} lessonSeries={lessonSeries} />
        ))}
      </ul>
      <LessonForm />
    </div>
  )
}

export default ResourcesPage
