import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

function SeriesAddForm() {
  return (
    <Button>
      <Plus className="mr-3 h-4 w-4" />
      <span>Add Series</span>
    </Button>
  )
}

export default SeriesAddForm
