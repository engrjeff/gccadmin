"use client"

import { ComponentProps } from "react"

export function DevotionInput(props: ComponentProps<"input">) {
  return (
    <input
      type="number"
      inputMode="numeric"
      aria-label="input number of devotions"
      className="appearance-none rounded-none border-x bg-background text-center tabular-nums outline-none hover:bg-muted/30 focus:ring-1 focus-visible:ring-primary"
      min={0}
      {...props}
      placeholder="0"
      onWheel={(e) => {
        e.currentTarget?.blur()
      }}
    />
  )
}
