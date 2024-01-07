"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import DiscipleBulkAddForm from "./disciple-bulk-add-form"

function DiscipleAddButton({ leaderId }: { leaderId?: string }) {
  return (
    <>
      <Link
        href={{ pathname: "/disciples/new", query: { leaderId } }}
        className={cn(buttonVariants({ size: "sm" }), "xl:hidden")}
      >
        <Plus className="mr-3 h-4 w-4" />
        <span>Add</span>
      </Link>

      <div className="hidden grow-0 divide-x divide-amber-500 self-start rounded-md xl:block">
        <Link
          href={{ pathname: "/disciples/new", query: { leaderId } }}
          className={cn(buttonVariants({ size: "sm" }), "rounded-r-none")}
        >
          <Plus className="mr-3 h-4 w-4" />
          <span>Add</span>
        </Link>
        <DiscipleBulkAddForm />
      </div>
    </>
  )
}

export default DiscipleAddButton
