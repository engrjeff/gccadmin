import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    errorFormat: "minimal",
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
