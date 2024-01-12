import * as React from "react"

import { cn } from "@/lib/utils"

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm capitalize ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger md:h-10",
          className
        )}
        {...props}
      />
    )
  }
)
NativeSelect.displayName = "NativeSelect"

export { NativeSelect }
