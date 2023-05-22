import { Metadata } from "next"

import SignInForm from "./components/SignInForm"

export const metadata: Metadata = {
  title: "Sign In - Grace City App",
}

export default function SigninPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <SignInForm />
      </div>
    </div>
  )
}
