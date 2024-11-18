"use client"

import { useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"

interface AttendanceTogglerProps {
  isPresent: boolean | undefined
  studentId: string
}

export function AttendanceToggler({
  isPresent,
  studentId,
}: AttendanceTogglerProps) {
  const [status, setStatus] = useState<boolean | undefined>(() => isPresent)

  return (
    <button
      data-ispresent={status}
      tabIndex={-1}
      aria-label={status ? "mark as absent" : "mark as present"}
      className="inline-flex h-9 w-full items-center justify-center rounded-none outline-none hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary"
      onClick={() => setStatus((old) => (!old ? true : false))}
    >
      {status !== undefined ? (
        status ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <XIcon className="size-4 text-red-500" />
        )
      ) : (
        ""
      )}
    </button>
  )
}
