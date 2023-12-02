import { cn } from "@/lib/utils"

function FormErrorMessage({
  id,
  error,
  className,
}: {
  id: string
  error?: string
  className?: string
}) {
  if (!error) return null

  return (
    <span
      id={id}
      className={cn("mt-2 inline-block text-xs text-danger", className)}
    >
      {error}
    </span>
  )
}

export default FormErrorMessage
