import { Lesson, LessonSeries } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function LessonSeriesCard({
  lessonSeries,
}: {
  lessonSeries: LessonSeries & { lessons: Lesson[] }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{lessonSeries.title}</CardTitle>
        <CardDescription>{lessonSeries.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          {lessonSeries.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground">
          Includes {lessonSeries.lessons.length} lessons
        </p>
      </CardContent>
      <CardFooter>
        <Button>View</Button>
      </CardFooter>
    </Card>
  )
}

export default LessonSeriesCard
