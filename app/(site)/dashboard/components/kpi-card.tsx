import { Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPICardProps {
  title: string
  value: any
  subValue?: string
}

function KPICard({ title, value, subValue }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-sm font-medium capitalize tracking-tight">
          {title}
        </CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subValue ? (
          <span className="text-sm text-muted-foreground">{subValue}</span>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default KPICard
