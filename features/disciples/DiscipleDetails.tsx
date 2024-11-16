import { PropsWithChildren } from "react"
import { format } from "date-fns"

import { removeUnderscores } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import { DiscipleWithLeader } from "./columns"

interface DiscipleDetailsProps {
  disciple: DiscipleWithLeader
}

export function DiscipleDetails({
  disciple,
  children,
}: PropsWithChildren<DiscipleDetailsProps>) {
  return (
    <>
      <div className="divide-y">
        <div className="px-4 py-2 text-sm">
          <p>Name</p>
          <p className="text-muted-foreground">{disciple.name}</p>
        </div>
        <div className="px-4 py-2 text-sm">
          <p>Leader</p>
          <p className="text-muted-foreground">{disciple.leader?.name}</p>
        </div>
        <div className="px-4 py-2 text-sm">
          <p>Address</p>
          <p className="text-muted-foreground">{disciple.address}</p>
        </div>
        <div className="px-4 py-2 text-sm">
          <p>Birthdate</p>
          <p className="text-muted-foreground">
            {format(disciple.birthdate, "MMMM dd, yyyy")}
          </p>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm capitalize">
          <p>Member Type</p>
          <Badge variant={disciple.member_type}>
            {removeUnderscores(disciple.member_type).toLowerCase()}
          </Badge>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Cell Status</p>
          <Badge variant={disciple.cell_status}>
            {removeUnderscores(disciple.cell_status)}
          </Badge>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Church Status</p>
          <Badge variant={disciple.church_status}>
            {removeUnderscores(disciple.church_status)}
          </Badge>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Process Level</p>
          <Badge variant={disciple.process_level}>
            {removeUnderscores(disciple.process_level)}
          </Badge>
        </div>
        <div className="space-y-2 px-4 py-2 text-sm">
          <p>Process Level Status</p>
          <Badge variant={disciple.process_level_status}>
            {removeUnderscores(disciple.process_level_status)}
          </Badge>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </>
  )
}
