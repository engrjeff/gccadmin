import * as React from "react"
import { cva, VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border rounded-md px-2 py-px text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary/80 border-transparent text-primary-foreground",
        secondary:
          "bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground",
        destructive:
          "bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground",
        info: "border-none bg-info text-black",
        pink: "border-none bg-pink-500 text-black",
        outline: "text-foreground",

        FILTER:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",

        FIRST_TIMER:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        SECOND_TIMER:
          "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",
        THIRD_TIMER:
          "bg-orange-400/10 border-orange-400/20 text-orange-400 capitalize",
        REGULAR:
          "bg-violet-500/10 border-violet-500/20 text-violet-500 capitalize",

        NACS: "bg-gray-400/10 border-gray-400/20 text-gray-400 capitalize",
        ACS: "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",

        NONE: "bg-gray-400/10 border-gray-400/20 text-gray-400 capitalize",
        PREENC: "bg-blue-400/10 border-blue-400/20 text-blue-400 capitalize",
        ENCOUNTER:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        LEADERSHIP_1:
          "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",
        LEADERSHIP_2:
          "bg-orange-400/10 border-orange-400/20 text-orange-400 capitalize",
        LEADERSHIP_3:
          "bg-violet-500/10 border-violet-500/20 text-violet-500 capitalize",

        NOT_STARTED:
          "bg-gray-400/10 border-gray-400/20 text-gray-400 capitalize",
        ON_GOING:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        PENDING_REQUIREMENTS:
          "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",
        FINISHED:
          "bg-violet-500/10 border-violet-500/20 text-violet-500 capitalize",
        UNFINISHED:
          "bg-rose-400/10 border-rose-400/20 text-rose-400 capitalize",
        DROPPED: "bg-red-400/10 border-red-400/20 text-red-400 capitalize",

        KIDS: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        MEN: "bg-blue-400/10 border-blue-400/20 text-blue-400 capitalize",
        WOMEN: "bg-rose-400/10 border-rose-400/20 text-rose-400 capitalize",
        YOUTH: "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",
        YOUNGPRO:
          "bg-orange-400/10 border-orange-400/20 text-orange-400 capitalize",

        OPEN: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        SOULWINNING:
          "bg-amber-400/10 border-amber-400/20 text-amber-400 capitalize",
        DISCIPLESHIP:
          "bg-blue-400/10 border-blue-400/20 text-blue-400 capitalize",

        ACTIVE:
          "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 capitalize",
        INACTIVE: "bg-red-400/10 border-red-400/20 text-red-400 capitalize",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
