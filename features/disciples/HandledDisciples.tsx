"use client"

import { Loader2Icon } from "lucide-react"

import { useHandledDisciples } from "@/hooks/use-handled-disciples"
import { Badge } from "@/components/ui/badge"

export function HandledDisciples({ discipleId }: { discipleId: string }) {
  const disciple = useHandledDisciples(discipleId)

  if (disciple.isLoading)
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Loader2Icon size={32} className="animate-spin" />
        <p>Getting data...</p>
      </div>
    )

  const count = disciple.data?.handled_disciples?.length

  if (!count)
    return (
      <div className="flex h-28 items-center justify-center px-4 py-3">
        <p className="w-2/3 text-center text-muted-foreground">
          {disciple.data?.name} has no handled disciples yet.
        </p>
      </div>
    )

  const disciplesHandled = disciple.data?.handled_disciples

  return (
    <ul className="divide-y">
      {disciplesHandled?.map((d, index) => (
        <li key={`handled-disciple-${d.id}-${index}`}>
          <div className="flex items-start gap-4 px-4 py-3">
            <span className="text-sm text-muted-foreground">{index + 1}</span>
            <h3 className="mb-1 flex items-center gap-2 whitespace-nowrap text-sm font-semibold">
              {d.name}
            </h3>
            <Badge
              className="ml-auto"
              variant={d.isActive ? "ACTIVE" : "INACTIVE"}
            >
              {d.isActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}
