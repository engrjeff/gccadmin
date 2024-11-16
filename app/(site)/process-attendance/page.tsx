import { Suspense } from "react"
import { Metadata } from "next"
import { AttendancePeriodListing } from "@/features/process-attendance/AttendancePeriodListing"
import { ProcessAttendancePeriodAddModal } from "@/features/process-attendance/ProcessAttendancePeriodAddModal"

import PageTitle from "@/components/page-title"

export const metadata: Metadata = {
  title: "Process - Attendance",
}

function ProcessAttendancePage() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden p-4">
      <div className="flex items-start justify-between gap-4">
        <PageTitle
          title="Process Attendance"
          subtitle="View and manage process attendance."
        />
        <ProcessAttendancePeriodAddModal />
      </div>

      <Suspense>
        <AttendancePeriodListing />
      </Suspense>
    </div>
  )
}

export default ProcessAttendancePage
