import { Metadata } from "next"

import PageTitle from "@/components/page-title"

import SeriesAddForm from "./components/series-add-form"
import SeriesList from "./components/series-list"

export const metadata: Metadata = {
  title: "Resources",
}

function ResourcesPage() {
  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle title="Resources" subtitle="GCC Lessons" />
        <SeriesAddForm />
      </div>
      <SeriesList />
    </>
  )
}

export default ResourcesPage
