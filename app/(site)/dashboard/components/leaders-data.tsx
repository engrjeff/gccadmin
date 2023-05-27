"use client"

import { BarList, Bold, Flex, Text } from "@tremor/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function LeadersData({
  leadersDiscipleData,
}: {
  leadersDiscipleData: { name: string; disciples: number }[]
}) {
  const totalDisciples = leadersDiscipleData.reduce(
    (sum, curr) => sum + curr.disciples,
    0
  )

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Leader&apos;s Data</CardTitle>
        <CardDescription className="text-3xl font-bold text-foreground">
          {totalDisciples}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            total disciples
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="mt-4">
          <Text className="text-muted-foreground">
            <Bold>Leader</Bold>
          </Text>
          <Text className="text-muted-foreground">
            <Bold>Disciples</Bold>
          </Text>
        </Flex>
        <BarList
          color="indigo"
          data={leadersDiscipleData.map((d) => ({ ...d, value: d.disciples }))}
          className="mt-2"
        />
      </CardContent>
    </Card>
    // <ResponsiveContainer width="100%" height={300} className="-ml-16">
    //   <BarChart data={leadersDiscipleData} barSize={16} layout="vertical">
    //     <XAxis
    //       dataKey="disciples"
    //       type="number"
    //       stroke="#7F8EA3"
    //       fontSize={12}
    //       tickLine={false}
    //       axisLine={false}
    //     />
    //     <YAxis
    //       width={200}
    //       stroke="#7F8EA3"
    //       fontSize={12}
    //       tickLine={false}
    //       axisLine={false}
    //       type="category"
    //       dataKey="name"
    //     />
    //     <Tooltip
    //       cursor={{ fill: "#1d283a" }}
    //       content={({ active, payload, label }) => {
    //         if (active && payload && payload.length) {
    //           return (
    //             <div className="rounded border bg-background p-3">
    //               <p className="text-sm font-semibold">{label}</p>
    //               <p className="text-sm text-muted-foreground">
    //                 {payload[0].value} Disciples
    //               </p>
    //             </div>
    //           )
    //         }

    //         return null
    //       }}
    //     />
    //     <Bar dataKey="disciples" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
    //   </BarChart>
    // </ResponsiveContainer>
  )
}

export default LeadersData
