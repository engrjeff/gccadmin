import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

function DiscipleSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (searchValue: string) => void
}) {
  return (
    <div className="flex items-center gap-2 border-b px-4 py-3">
      <SearchIcon className="h-5 w-5" />
      <Input
        placeholder="Search disciples by name..."
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full border-none ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent"
      />
    </div>
  )
}

export default DiscipleSearch
