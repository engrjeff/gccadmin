"use client"

import { DonutChart } from "@tremor/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ChurchStatusDataProps {
  data: {
    value: number
    name: string
    valueDesc: string
  }[]
}

const colors = ["bg-rose-500", "bg-cyan-500", "bg-amber-500"]

function ChurchStatusData({ data }: ChurchStatusDataProps) {
  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Church Data</CardTitle>
        <CardDescription>Church members data by status</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart
          className="my-6"
          data={data}
          category="value"
          index="name"
          colors={["rose", "cyan", "amber"]}
        />
        <div className="space-y-3">
          {data.map((item, index) => (
            <div className="flex items-center" key={item.name}>
              <Avatar className="flex h-4 w-4 items-center justify-center space-y-0 rounded">
                <AvatarFallback className={cn("rounded", colors[index])} />
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.valueDesc}
                </p>
              </div>
              <div className="ml-auto text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ChurchStatusData
