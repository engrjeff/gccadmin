"use client"

import { ArrowTrendingUpIcon } from "@heroicons/react/20/solid"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ProcessLevelDataProps {
  data: {
    value: number
    name: string
    valueDesc: string
  }[]
}

function ProcessLevelData({ data }: ProcessLevelDataProps) {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>GPS (Process)</CardTitle>
        <CardDescription>Growth Process System Data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
            <div className="flex items-center" key={item.name}>
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 rounded">
                <AvatarFallback className="rounded text-orange-500">
                  <ArrowTrendingUpIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.valueDesc}
                </p>
              </div>
              <div className="ml-auto font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProcessLevelData
