import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <p className="text-6xl font-bold">404</p>
      <p className="text-xl font-medium text-muted-foreground">
        Disciple not found
      </p>
      <Link href="/disciples" className={buttonVariants()}>
        Go Back to List
      </Link>
    </div>
  )
}

export default NotFound
