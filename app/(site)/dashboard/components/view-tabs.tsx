"use client"

import { usePathname } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ViewTabs() {
  const pathname = usePathname()

  return (
    <Tabs
      defaultValue={pathname === "/dashboard/monthly" ? "monthly" : "weekly"}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weekly" asChild>
          <a href="/dashboard">Weekly</a>
        </TabsTrigger>
        <TabsTrigger value="monthly" asChild>
          <a href="/dashboard/monthly">Monthly</a>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
