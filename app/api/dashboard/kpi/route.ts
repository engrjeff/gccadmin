import { NextResponse } from "next/server"

import { getKPIData } from "@/app/(site)/dashboard/service"

export async function GET() {
  try {
    const kpiData = await getKPIData()

    return NextResponse.json(kpiData)
  } catch (error) {
    throw error
  }
}
