"use client"

import Link from "next/link"
import { Lesson, LessonSeries } from "@prisma/client"
import { Edit, FilePlus, MoreVertical } from "lucide-react"

import { useLessonFormSheetStore } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function LessonSeriesCard({
  lessonSeries,
}: {
  lessonSeries: LessonSeries & { lessons: Lesson[] }
}) {
  const { setSelectedSeries, openForm } = useLessonFormSheetStore()

  const handleAddLessonClick = () => {
    setSelectedSeries(lessonSeries)

    openForm()
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative">
        <CardTitle>{lessonSeries.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-3 top-2 h-8 w-8 p-0"
            >
              <span className="sr-only">Menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="flex w-full">
                <Edit className="mr-2 h-4 w-4" />
                <span>Update</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button className="flex w-full" onClick={handleAddLessonClick}>
                <FilePlus className="mr-2 h-4 w-4" />
                <span>Add Lesson</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Badge variant="outline" className="self-start rounded">
          {lessonSeries.lessons.length} Lessons
        </Badge>
        <CardDescription>{lessonSeries.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {lessonSeries.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/resources/${lessonSeries.id}`}
          className={cn(buttonVariants(), "w-full")}
        >
          View
        </Link>
      </CardFooter>
    </Card>
  )
}

export default LessonSeriesCard
