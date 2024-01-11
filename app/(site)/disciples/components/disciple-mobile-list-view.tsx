import { type Table } from "@tanstack/react-table"

import { DiscipleWithLeader } from "./columns"
import DiscipleMobileListItem from "./disciple-mobile-list-item"

interface DiscipleMobileListViewProps {
  table: Table<DiscipleWithLeader>
}

function DiscipleMobileListView({ table }: DiscipleMobileListViewProps) {
  return (
    <div>
      {table.getRowModel().rows?.length ? (
        <ul className="space-y-4">
          {table.getRowModel().rows.map((row) => (
            <li
              key={`disciple-mobile-${row.id}`}
              data-state={row.getIsSelected() && "selected"}
              onClick={() => {}}
            >
              <DiscipleMobileListItem disciple={row.original} />
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <p className="h-24 text-center">No results.</p>
        </div>
      )}
    </div>
  )
}

export default DiscipleMobileListView
