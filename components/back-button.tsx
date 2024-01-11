"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

function BackButton() {
  const router = useRouter()

  return (
    <button
      className="inline-flex items-center gap-3 font-medium hover:underline"
      onClick={router.back}
    >
      <ArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
      <span className="text-sm">Back</span>
    </button>
  )
}

export default BackButton
