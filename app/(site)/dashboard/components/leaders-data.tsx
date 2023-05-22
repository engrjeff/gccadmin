"use client"

import { BarChart } from "@tremor/react"

function LeadersData({
  leadersDiscipleData,
}: {
  leadersDiscipleData: { name: string; disciples: number }[]
}) {
  return (
    <BarChart
      className="mt-1"
      data={leadersDiscipleData}
      index="name"
      categories={["disciples"]}
      colors={["amber"]}
      yAxisWidth={48}
    />
  )
}

export default LeadersData
