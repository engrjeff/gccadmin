import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const ADMIN_EMAIL = "gccsystemph@gmail.com"

async function main() {
  // delete all records except the admin
  await prisma.user.deleteMany({
    where: {
      email: {
        not: ADMIN_EMAIL,
      },
    },
  })

  await prisma.cellReportAttendees.deleteMany()
  await prisma.cellReportAssistant.deleteMany()
  await prisma.cellReport.deleteMany()
  await prisma.lessonsTakenByDisciple.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.lessonSeries.deleteMany()
  await prisma.disciple.deleteMany()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    if (e instanceof Error) {
      console.error(e.message)
    } else {
      console.error(e)
    }

    await prisma.$disconnect()
    process.exit(1)
  })
