import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resources",
}

async function ResourcesPage() {
  return (
    <>
      <div className="relative flex flex-col gap-4 overflow-hidden p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-1 text-lg font-bold tracking-tight">Resources</h2>
            <p className="hidden text-sm text-muted-foreground lg:block">
              View and manage GCC Lessons.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResourcesPage
