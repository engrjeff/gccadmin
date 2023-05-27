"use client"

import { BuildingOffice2Icon } from "@heroicons/react/20/solid"

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

function ChurchStatusData({ data }: ChurchStatusDataProps) {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Church Data</CardTitle>
        <CardDescription>Church members data by status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
            <div className="flex items-center" key={item.name}>
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 rounded">
                <AvatarFallback className="rounded text-amber-500">
                  <BuildingOffice2Icon className="h-4 w-4" />
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

export default ChurchStatusData
