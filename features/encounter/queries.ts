import { prisma } from "@/lib/db"

export async function getEncounterBatchList() {
  try {
    const results = await prisma.encounterBatch.findMany({
      orderBy: {
        endDate: "desc",
      },
    })

    return results
  } catch (error) {
    return []
  }
}

export type GetEncounterBatchArgs = {
  batchId: string | undefined
  memberStatus: "active" | "inactive" | undefined
}

export async function getEncounterBatch({
  batchId,
  memberStatus,
}: GetEncounterBatchArgs) {
  try {
    if (!batchId) {
      const latestBatch = await prisma.encounterBatch.findFirst({
        where: { id: batchId },
        include: {
          members: {
            where: {
              isActive: memberStatus === "inactive" ? false : true,
            },
            include: {
              leader: {
                select: {
                  name: true,
                },
              },
              handled_by: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              name: "asc",
            },
          },
        },
        orderBy: {
          endDate: "desc",
        },
      })

      return latestBatch
    }

    const encounterBatch = await prisma.encounterBatch.findUnique({
      where: {
        id: batchId,
      },
      include: {
        members: {
          where: {
            isActive: memberStatus === "inactive" ? false : true,
          },
          include: {
            leader: {
              select: {
                name: true,
              },
            },
            handled_by: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    })

    return encounterBatch
  } catch (error) {
    console.log("getEncounterBatch Error: ", error)
    return null
  }
}
