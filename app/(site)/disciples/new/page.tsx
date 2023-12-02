import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import PageTitle from "@/components/page-title"

import DiscipleForm from "../components/disciple-form"
import { getPrimaryLeaders } from "../service/disciples"

async function CreateDisciplePage() {
  const leaders = await getPrimaryLeaders()

  return (
    <div className="max-h-full space-y-4 overflow-y-auto">
      <Link
        href="/disciples"
        className="inline-flex items-center gap-3 font-medium hover:underline"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="sr-only">Back to </span>
        <span>Disciples</span>
      </Link>
      <PageTitle
        title="Add Disciple"
        subtitle="Fill in the form to create a new disciple record."
      />
      <DiscipleForm leaderOptions={leaders} />
    </div>
  )
}

export default CreateDisciplePage
