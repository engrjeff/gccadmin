"use client"

import { useState } from "react"
import { CheckIcon, XIcon } from "lucide-react"

interface AssignmentTogglerProps {
  hasAssignment: boolean | null
  studentId: string
}

export function AssignmentToggler({
  hasAssignment,
  studentId,
}: AssignmentTogglerProps) {
  const [status, setStatus] = useState<boolean | null>(() => hasAssignment)

  return (
    <button
      data-ispresent={status}
      tabIndex={-1}
      aria-label={status ? "mark as absent" : "mark as present"}
      className="inline-flex h-9 w-full items-center justify-center rounded-none outline-none hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-primary active:bg-muted/30"
      onClick={() =>
        setStatus((old) => {
          const _status = [null, true, false]

          const nextIndex = old === false ? 0 : (_status.indexOf(old) % 3) + 1

          return _status[nextIndex]
        })
      }
    >
      {status !== null ? (
        status ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <XIcon className="size-4 text-red-500" />
        )
      ) : (
        <span className="text-xs text-muted-foreground">n/a</span>
      )}
    </button>
  )
}
