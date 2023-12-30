import React from "react"

import DiscipleDetailHeader from "../components/disciple-detail-header"
import DiscipleDetailsTabs from "../components/disciple-details-tabs"

interface Props {
  children: React.ReactNode
  params: { id: string }
}

function DiscipleDetailLayout({ children, params }: Props) {
  return (
    <div className="max-h-full space-y-4 overflow-y-auto px-4 lg:px-6">
      <DiscipleDetailHeader discipleId={params.id} />
      <DiscipleDetailsTabs />
      {children}
    </div>
  )
}

export default DiscipleDetailLayout
