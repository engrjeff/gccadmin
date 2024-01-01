"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import DiscipleBulkAddForm from "./disciple-bulk-add-form"

function DiscipleAddButton({ leaderId }: { leaderId?: string }) {
  return (
    <div className="grow-0 divide-x divide-violet-600 self-start rounded-md">
      <Link
        href={{ pathname: "/disciples/new", query: { leaderId } }}
        className={cn(buttonVariants({ size: "sm" }), "rounded-r-none")}
      >
        <Plus className="mr-3 h-4 w-4" />
        <span>Add</span>
      </Link>
      <DiscipleBulkAddForm />
    </div>
  )
}

export default DiscipleAddButton
