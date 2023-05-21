import { redirect } from "next/navigation"

import { prisma as db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export const getLessonSeries = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const lessonSeriesList = await db.lessonSeries.findMany({
    include: {
      lessons: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return lessonSeriesList
}

export const getSeriesById = async (id: string) => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const lessonSeries = await db.lessonSeries.findFirst({
    where: {
      id,
    },
    include: {
      lessons: true,
    },
  })

  return lessonSeries
}
