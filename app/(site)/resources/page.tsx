import PageTitle from "@/components/page-title"

import LessonSeriesCard from "./components/lesson-series-card"
import { getLessonSeries } from "./service"

async function ResourcesPage() {
  const lessonSeriesList = await getLessonSeries()

  return (
    <div className="space-y-6">
      <PageTitle title="Lessons" subtitle="GCC Resources for cell groups" />
      <ul className="grid grid-cols-4 gap-6">
        {lessonSeriesList.map((lessonSeries) => (
          <LessonSeriesCard key={lessonSeries.id} lessonSeries={lessonSeries} />
        ))}
      </ul>
    </div>
  )
}

export default ResourcesPage
