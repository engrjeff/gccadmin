import { getLessonSeries } from "../service"
import LessonSeriesCard from "./lesson-series-card"
import LessonsView from "./lessons-view"

async function SeriesList() {
  const seriesList = await getLessonSeries()

  return (
    <div className="flex">
      <ul className="flex-1 space-y-3">
        {seriesList.map((series) => (
          <li key={`series-${series.id}`}>
            <LessonSeriesCard seriesItem={series} />
          </li>
        ))}
      </ul>
      <div className="hidden xl:ml-4 xl:block">
        <LessonsView />
      </div>
    </div>
  )
}

export default SeriesList
