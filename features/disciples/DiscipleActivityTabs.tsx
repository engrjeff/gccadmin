"use client"

import { useQueryState } from "nuqs"

import { useIsAdmin } from "@/hooks/use-isadmin"
import { usePageState } from "@/hooks/use-page-state"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DiscipleActivityTabs() {
  const [statusQuery, setStatusQuery] = useQueryState("status", {
    shallow: false,
  })

  const [page, setPage] = usePageState()

  const { isAdmin } = useIsAdmin()

  return (
    <Tabs
      onValueChange={(value) => {
        setStatusQuery(value)

        if (page) {
          setPage(null)
        }
      }}
      value={statusQuery ?? "active"}
    >
      <TabsList className="h-9">
        <TabsTrigger value="active" className="py-1">
          Active
        </TabsTrigger>
        <TabsTrigger value="inactive" className="py-1">
          Inactive
        </TabsTrigger>
        {!isAdmin ? (
          <TabsTrigger value="primary" className="py-1">
            Primary
          </TabsTrigger>
        ) : null}
      </TabsList>
    </Tabs>
  )
}
