"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DiscipleTabs() {
  const searchParams = useSearchParams()

  const isActive = searchParams.get("isActive")

  return (
    <Tabs
      defaultValue={
        !isActive ? "active" : isActive === "true" ? "active" : "inactive"
      }
      className="ml-2 mt-4 w-[300px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active" asChild>
          <Link href={{ pathname: "/disciples", query: { isActive: true } }}>
            Active
          </Link>
        </TabsTrigger>
        <TabsTrigger value="inactive" asChild>
          <Link href={{ pathname: "/disciples", query: { isActive: false } }}>
            Inactive
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default DiscipleTabs
