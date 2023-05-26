"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function LeadersData({
  leadersDiscipleData,
}: {
  leadersDiscipleData: { name: string; disciples: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300} className="-ml-16">
      <BarChart data={leadersDiscipleData} barSize={16} layout="vertical">
        <XAxis
          dataKey="disciples"
          type="number"
          stroke="#7F8EA3"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          width={200}
          stroke="#7F8EA3"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          type="category"
          dataKey="name"
        />
        <Tooltip
          cursor={{ fill: "#1d283a" }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded border bg-background p-3">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">
                    {payload[0].value} Disciples
                  </p>
                </div>
              )
            }

            return null
          }}
        />
        <Bar dataKey="disciples" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default LeadersData
