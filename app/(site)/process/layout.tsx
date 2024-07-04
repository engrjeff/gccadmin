import React from "react"

import ProcessLayoutHeader from "./components/ProcessLayoutHeader"

function ProcessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProcessLayoutHeader />
      {children}
    </>
  )
}

export default ProcessLayout
