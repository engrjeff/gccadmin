import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import PageTitle from "@/components/page-title"

import DiscipleForm from "../components/disciple-form"

function CreateDisciplePage() {
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
      <div className="mx-auto max-w-screen-lg space-y-4">
        <PageTitle
          title="Add Disciple"
          subtitle="Fill in the form to create a new disciple record."
        />
        <DiscipleForm />
      </div>
    </div>
  )
}

export default CreateDisciplePage
