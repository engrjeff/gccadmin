import { Metadata } from "next"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Process - Tracking",
}

function TrackingPage() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Tracking"
          subtitle="Grace City Process Reports and Tracking"
        />
      </div>
    </div>
  )
}

export default TrackingPage
