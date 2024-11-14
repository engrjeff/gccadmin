"use client"

import { useEffect, useState, useTransition } from "react"
import { useDebounce } from "@uidotdev/usehooks"
import { ArrowRight, Loader2Icon, Search, XIcon } from "lucide-react"
import { useQueryState } from "nuqs"
import { useSpinDelay } from "spin-delay"

import { usePageState } from "@/hooks/use-page-state"
import { Input } from "@/components/ui/input"

interface SearchFieldProps {
  placeholder?: string
}

export function SearchField({ placeholder = "Search..." }: SearchFieldProps) {
  const [isPending, startTransition] = useTransition()

  const showSpinner = useSpinDelay(isPending, {
    delay: 400,
    minDuration: 200,
  })

  const [query, setQuery] = useQueryState("q", {
    shallow: false,
    startTransition,
  })

  const [searchTerm, setSearchTerm] = useState(() => query ?? "")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [page, setPage] = usePageState()

  useEffect(() => {
    if (debouncedSearchTerm) {
      setQuery(debouncedSearchTerm)
      if (page) {
        setPage(null)
      }
    } else {
      setQuery(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm])

  return (
    <form
      className="relative"
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)

        const q = form.get("q") as string

        if (q) {
          setQuery(q)
        } else {
          setQuery(null)
        }
      }}
    >
      <Input
        aria-label="Search"
        id="search"
        name="q"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        className="peer h-10 pe-9 ps-9 lg:h-8"
        placeholder={placeholder}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
        <Search size={16} strokeWidth={2} />
      </div>

      {query ? (
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="clear search"
          type="button"
          onClick={() => {
            setSearchTerm("")
            setQuery(null)
          }}
        >
          {showSpinner ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <XIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="hover:text-red-500"
            />
          )}
        </button>
      ) : (
        <button
          className="absolute inset-y-0 end-0 hidden h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 ring-offset-background transition-shadow hover:text-foreground focus-visible:border focus-visible:border-ring focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          {showSpinner ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      )}
    </form>
  )
}
