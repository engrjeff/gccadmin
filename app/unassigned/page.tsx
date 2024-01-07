import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

async function UnassignedUserPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Unconfirmed Account</h1>
      <p className="text-center text-muted-foreground">
        Your account needs to be confirmed first by the Admin. Once verified,
        you will be able to access the app.
      </p>
      <p className="mb-6 text-center text-muted-foreground">
        You may refresh this page to check if your account has been verified.
      </p>
      <Link href="/dashboard" className={buttonVariants()}>
        Refresh
      </Link>
      <span className="mt-6">&mdash; Jeff & Kim</span>
    </div>
  )
}

export default UnassignedUserPage
