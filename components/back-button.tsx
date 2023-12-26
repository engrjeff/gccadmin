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
      <ArrowLeft className="h-5 w-5" />
      <span>Back</span>
    </button>
  )
}

export default BackButton
