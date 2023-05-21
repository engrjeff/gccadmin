import Link from "next/link"

import { getCurrentUser } from "@/lib/session"
import { buttonVariants } from "@/components/ui/button"
import Logo from "@/components/logo"

export default async function IndexPage() {
  const user = await getCurrentUser()

  return (
    <section className="container flex h-screen items-center justify-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex flex-col items-center gap-3 text-2xl font-bold">
        <Logo />
        <h1>Welcome back!</h1>
        {user ? (
          <Link href="/dashboard" className={buttonVariants()}>
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/signin"
            className={buttonVariants({ variant: "outline" })}
          >
            Sign In
          </Link>
        )}
      </div>
    </section>
  )
}
