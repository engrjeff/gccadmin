"use client"

import { ReactNode } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type ListItem = {
  name: string
  icon: ReactNode
  value: number
  valueDesc: string
}

interface ListDataProps {
  title: string
  description: string
  data: ListItem[]
}

function ListData({ data, title, description }: ListDataProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
            <div className="flex items-center" key={item.name}>
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 rounded">
                <AvatarFallback className="rounded text-sky-500">
                  {item.icon}
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

export default ListData
