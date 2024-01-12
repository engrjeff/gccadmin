import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

function DiscipleSearch({
  value,
  onChange,
  placeholder = "Search disciples by name...",
}: {
  value: string
  onChange: (searchValue: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-1 items-center gap-2 rounded-full bg-muted px-2 lg:rounded-none lg:border-b lg:bg-transparent lg:px-4 lg:py-2">
      <SearchIcon className="h-4 w-4 lg:h-5 lg:w-5" />
      <Input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full border-none pl-0 ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent lg:px-4"
      />
    </div>
  )
}

export default DiscipleSearch
