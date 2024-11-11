import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCurrentSession } from "@/lib/session"

import SignInForm from "./components/SignInForm"

export const metadata: Metadata = {
  title: "Sign In",
}

export default async function SigninPage() {
  const session = await getCurrentSession()

  if (session && session.user) {
    redirect("/dashboard")
  }

  return (
    <div className="container fixed inset-0 flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignInForm />
      </div>
    </div>
  )
}
