import { Metadata } from "next"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Resources",
}

function ResourcesPage() {
  return (
    <div className="mb-4 flex justify-between">
      <PageTitle title="Resources" subtitle="GCC Lessons" />
    </div>
  )
}

export default ResourcesPage
