import { format } from "date-fns"

import { DiscipleWithLeader } from "./columns"

interface Props {
  disciple: DiscipleWithLeader
}

function BasicDetailsCard({ disciple }: Props) {
  return (
    <div className="divide-y rounded-lg bg-muted shadow-lg">
      <div className="p-4">
        <h3 className="font-semibold">Basic Information</h3>
      </div>
      <div className="p-4 text-sm">
        <p>Name</p>
        <p className="text-muted-foreground">{disciple.name}</p>
      </div>
      <div className="p-4 text-sm">
        <p>Leader</p>
        <p className="text-muted-foreground">{disciple.leader?.name}</p>
      </div>
      <div className="p-4 text-sm">
        <p>Address</p>
        <p className="text-muted-foreground">{disciple.address}</p>
      </div>
      <div className="p-4 text-sm">
        <p>Birthdate</p>
        <p className="text-muted-foreground">
          {format(disciple.birthdate, "MMMM dd, yyyy")}
        </p>
      </div>
      <div className="p-4 text-sm">
        <p>Member Type</p>
        <p className="capitalize text-muted-foreground">
          {disciple.member_type.toLowerCase()}
        </p>
      </div>
      <div className="p-4 text-sm">
        <p>Cell Status</p>
        <p className="capitalize text-muted-foreground">
          {disciple.cell_status.replace("_", " ").toLowerCase()}
        </p>
      </div>
      <div className="p-4 text-sm">
        <p>Church Status</p>
        <p className="capitalize text-muted-foreground">
          {disciple.church_status === "REGULAR"
            ? "Regular"
            : disciple.church_status}
        </p>
      </div>
      <div className="p-4 text-sm">
        <p>Process Level</p>
        <p className="capitalize text-muted-foreground">
          {disciple.process_level.replace("_", " ").toLowerCase()}
        </p>
      </div>
    </div>
  )
}

export default BasicDetailsCard
