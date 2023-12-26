import BackButton from "@/components/back-button"
import PageTitle from "@/components/page-title"

import DiscipleForm from "../components/disciple-form"

function CreateDisciplePage() {
  return (
    <div className="max-h-full space-y-4 overflow-y-auto">
      <BackButton />
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
