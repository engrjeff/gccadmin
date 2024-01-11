"use client"

import { ComponentProps, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"

import { buttonVariants } from "./ui/button"

const THRESHOLD = 0

function FAB({ className, ...props }: ComponentProps<typeof Link>) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up")

  const blocking = useRef(false)
  const prevScrollY = useRef(0)

  useEffect(() => {
    prevScrollY.current = window.scrollY

    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (Math.abs(scrollY - prevScrollY.current) >= THRESHOLD) {
        const newScrollDirection = scrollY > prevScrollY.current ? "down" : "up"

        setScrollDirection(newScrollDirection)

        prevScrollY.current = scrollY > 0 ? scrollY : 0
      }

      blocking.current = false
    }

    const onScroll = () => {
      if (!blocking.current) {
        blocking.current = true
        window.requestAnimationFrame(updateScrollDirection)
      }
    }

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollDirection])

  return (
    <Link
      {...props}
      className={cn(
        buttonVariants({ size: "icon" }),
        "fixed bottom-4 right-4 z-30 flex h-14 w-14 rounded-full shadow-md transition-transform duration-200",
        scrollDirection === "up" ? "scale-100" : "scale-0",
        className
      )}
    >
      <Plus className="h-6 w-6" />
      <span className="sr-only">Add</span>
    </Link>
  )
}

export default FAB
