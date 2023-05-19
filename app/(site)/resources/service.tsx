import { redirect } from "next/navigation"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const getLessonSeries = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const lessonSeries = await db.lessonSeries.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return lessonSeries
}
