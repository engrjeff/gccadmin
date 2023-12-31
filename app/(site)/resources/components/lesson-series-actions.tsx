import { useState } from "react"
import { Lesson, LessonSeries } from "@prisma/client"
import { MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import LessonForm from "./lesson-form"
import SeriesEditForm from "./series-edit-form"

type SeriesWithLessons = LessonSeries & { lessons: Lesson[] }

function LessonSeriesActions({ series }: { series: SeriesWithLessons }) {
  const [activeAction, setActiveAction] = useState<"edit" | "add-lesson">()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Lesson series actions menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveAction("edit")}>
            Edit Series
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveAction("add-lesson")}>
            Add Lesson
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={activeAction === "edit"}
        onOpenChange={() => setActiveAction(undefined)}
      >
        <DialogContent className="mx-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update {series.title}</DialogTitle>
            <DialogDescription>Enter your changes then save.</DialogDescription>
          </DialogHeader>
          <SeriesEditForm
            series={{
              id: series.id,
              title: series.title,
              description: series.description,
              tags: series.tags,
            }}
            onDone={() => setActiveAction(undefined)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeAction === "add-lesson"}
        onOpenChange={() => setActiveAction(undefined)}
      >
        <DialogContent className="mx-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Lesson</DialogTitle>
            <DialogDescription>
              Add a lesson under <strong>{series.title}</strong>
            </DialogDescription>
          </DialogHeader>
          <LessonForm
            series={series}
            onDone={() => setActiveAction(undefined)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LessonSeriesActions
