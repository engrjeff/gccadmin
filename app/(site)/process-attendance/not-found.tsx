import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

function AttendanceNotFound() {
  return (
    <div className="flex flex-1 flex-col  items-center justify-center gap-6 p-6">
      Attendance Record Not Found
      <Link
        href="/process-attendance"
        className={buttonVariants({ size: "sm" })}
      >
        Back to List
      </Link>
    </div>
  )
}

export default AttendanceNotFound
