"use client"

import { useSelectedLayoutSegment } from "next/navigation"

import { capitalize } from "@/lib/utils"
import PageTitle from "@/components/page-title"

function ProcessLayoutHeader() {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="flex justify-end px-4 lg:mb-4 lg:justify-between lg:px-6">
      <PageTitle
        title={`GCC Process ${segment ? "- " + capitalize(segment) : ""}`}
        subtitle="Grace City Church Growth Process System (GPS)"
      />
    </div>
  )
}

export default ProcessLayoutHeader
