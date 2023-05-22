import { prisma as db } from "@/lib/db"

export const getDashboardData = async () => {
  const churchData = await db.disciple.groupBy({
    by: ["church_status"],

    _count: true,
  })

  const cellData = await db.disciple.groupBy({
    by: ["cell_status"],
    _count: true,
    orderBy: {
      cell_status: "desc",
    },
  })

  const processData = await db.disciple.groupBy({
    by: ["process_level"],
    _count: true,
    orderBy: {
      process_level: "asc",
    },
  })

  const primaryData = await db.disciple.findMany({
    where: {
      isPrimary: true,
    },
    select: {
      name: true,
      _count: {
        select: {
          disciples: true,
        },
      },
    },
    orderBy: {
      disciples: {
        _count: "desc",
      },
    },
  })

  return {
    churchData,
    cellData,
    processData,
    primaryData: primaryData.map((d) => ({
      name: d.name,
      disciples: d._count.disciples,
    })),
  }
}
