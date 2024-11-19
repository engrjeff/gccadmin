"use client"

import { useState } from "react"
import { DownloadIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SeriesWithLessons } from "@/hooks/use-lessons-series"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function LessonsViewModal({ series }: { series: SeriesWithLessons }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">View Lessons</Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="inset-y-2 right-2 flex h-auto w-[95%] flex-col gap-0 overflow-y-hidden rounded-lg border bg-background p-0 focus-visible:outline-none sm:max-w-lg"
      >
        <SheetHeader className="space-y-1 border-b p-4 text-left">
          <SheetTitle>{series.title}</SheetTitle>
          <SheetDescription>Lessons under {series.title}</SheetDescription>
        </SheetHeader>

        <ul className="max-h-[calc(100dvh-100px)] space-y-4 overflow-y-auto p-4">
          {series.lessons.map((lesson) => (
            <li key={lesson.id}>
              <div className="flex items-start justify-between rounded-md border p-4">
                <div className="max-w-[80%] space-y-2">
                  <p className="text-sm">{lesson.title}</p>
                  {lesson.description ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {lesson.description}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {lesson.scripture_references.slice(0, 3).map((sc, i) => (
                      <Badge key={sc + i} variant="NONE" className="px-1">
                        {sc}
                      </Badge>
                    ))}
                    {lesson.scripture_references.length > 3 ? (
                      <Badge variant="NONE" className="px-1 normal-case">
                        + {lesson.scripture_references.length - 3} more
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <a
                  title={`Download file for ${lesson.title}`}
                  href={lesson.file_url!}
                  download={lesson.file_url}
                  target="_blank"
                  className={cn(
                    buttonVariants({ size: "icon", variant: "outline" }),
                    "bg-muted/30",
                    {
                      "pointer-events-none opacity-60 text-muted-foreground":
                        !lesson.file_url,
                    }
                  )}
                >
                  <DownloadIcon className="size-4" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
