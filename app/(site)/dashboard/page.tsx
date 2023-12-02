import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Grace City App",
}

async function DashboardPage() {
  return (
    <div>
      <h1>Dashboard here</h1>
    </div>
  )
}

export default DashboardPage
