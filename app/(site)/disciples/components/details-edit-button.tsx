"use client"

import { Disciple } from "@prisma/client"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useCurrentDisciple } from "./current-disciple-provider"

function DetailsEditButton({ disciple }: { disciple: Disciple }) {
  const { setSelectedDisciple, setEditFormOpen } = useCurrentDisciple()

  return (
    <Button
      size="sm"
      onClick={() => {
        setSelectedDisciple(disciple)
        setEditFormOpen(true)
      }}
    >
      <Edit className="mr-2 h-4 w-5" />
      Edit
    </Button>
  )
}

export default DetailsEditButton
