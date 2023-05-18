"use client"

import { Button } from "@/components/ui/button"

function DeleteSection() {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <p className="text-sm font-semibold uppercase text-destructive">Delete</p>
      <Button size="sm" variant="destructive">
        Delete this disciple
      </Button>
    </div>
  )
}

export default DeleteSection
