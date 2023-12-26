import { Metadata } from "next"

import { getCurrentUser } from "@/lib/session"
import PageTitle from "@/components/page-title"

import SeriesAddForm from "./components/series-add-form"
import SeriesList from "./components/series-list"

export const metadata: Metadata = {
  title: "Resources",
}

async function ResourcesPage() {
  const user = await getCurrentUser()

  return (
    <>
      <div className="mb-4 flex justify-between">
        <PageTitle title="Resources" subtitle="GCC Lessons" />
        {user?.role === "ADMIN" ? <SeriesAddForm /> : null}
      </div>
      <SeriesList />
    </>
  )
}

export default ResourcesPage
