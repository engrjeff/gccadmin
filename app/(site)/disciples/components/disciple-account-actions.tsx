"use client"

import { User } from "@prisma/client"
import { useSession } from "next-auth/react"

import { DiscipleWithLeader } from "./columns"
import DiscipleActionForm from "./disciple-action-form"
import DiscipleAssignUserForm from "./disciple-assign-user-form"
import DiscipleDeleteAction from "./disciple-delete-action"

interface Props {
  userAccounts: User[]
  disciple: DiscipleWithLeader
}

function DiscipleAccountActions({ userAccounts, disciple }: Props) {
  const session = useSession()

  const isAdmin = session.data?.user?.role === "ADMIN"
  const isPrimary = session.data?.user?.isPrimary === true

  const shouldRenderActions = isAdmin || isPrimary

  if (!shouldRenderActions) return null

  return (
    <div className="space-y-4">
      <DiscipleActionForm disciple={disciple} />
      <DiscipleAssignUserForm
        accountId={disciple.userAccountId}
        userAccounts={userAccounts}
      />
      <DiscipleDeleteAction disciple={disciple} />
    </div>
  )
}

export default DiscipleAccountActions
