import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex gap-3">
        <Link href="/dashboard" className={buttonVariants()}>
          Dashboard
        </Link>
        <Link href="/signin" className={buttonVariants({ variant: "outline" })}>
          Sign In
        </Link>
      </div>
    </section>
  )
}
