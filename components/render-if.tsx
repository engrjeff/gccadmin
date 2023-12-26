import * as React from "react"

function RenderIf({
  condition,
  children,
}: React.PropsWithChildren<{ condition: boolean }>) {
  return <>{condition === true ? children : null}</>
}

export default RenderIf
