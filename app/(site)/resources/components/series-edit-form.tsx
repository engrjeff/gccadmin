"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import FormErrorMessage from "@/components/ui/form-error-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/ui/submit-button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import TagsInput from "@/components/tags-input"
import {
  LessonSeriesCreateInputs,
  seriesCreateSchema,
} from "@/app/api/series/schema"

function SeriesEditForm({
  series,
  onDone,
}: {
  series: {
    id: string
    title: string
    description: string | null
    tags: string[]
  }
  onDone: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LessonSeriesCreateInputs>({
    resolver: zodResolver(seriesCreateSchema),
    defaultValues: {
      title: series.title,
      description: series.description ?? undefined,
      tags: series.tags,
    },
  })

  const { errors } = form.formState

  const onError: SubmitErrorHandler<LessonSeriesCreateInputs> = (
    formErrors
  ) => {
    console.error("Lesson Series Edit Errors: ", formErrors)
  }

  const onSubmit: SubmitHandler<LessonSeriesCreateInputs> = async (values) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/series/${series.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response?.ok) {
        toast({
          title: "Something went wrong.",
          description: "The lesson series was not updated. Please try again.",
          variant: "destructive",
        })

        return
      }
      toast({
        title: "Success!",
        description: "The lesson series was updated successfully!",
        variant: "success",
      })

      router.refresh()
      form.reset()
      onDone()
    } catch (error: any) {
      console.log(error)

      if (error.message) {
        toast({
          title: "Error!",
          description: error.message,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)}>
      <fieldset
        disabled={isLoading}
        className="space-y-6 disabled:pointer-events-none disabled:opacity-80"
      >
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Series title"
              {...form.register("title")}
              aria-invalid={!!errors.title}
              aria-describedby="titleError"
            />
            <FormErrorMessage id="titleError" error={errors.title?.message} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Series description"
              {...form.register("description")}
              aria-invalid={!!errors.description}
              aria-describedby="descriptionError"
            />
            <FormErrorMessage
              id="descriptionError"
              error={errors.description?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scripture_references">Tags</Label>
            <Controller
              control={form.control}
              name="tags"
              render={({ field }) => (
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Type a tag like 'gospel' then press Enter"
                  aria-invalid={!!errors.tags}
                  aria-describedby="tagsError"
                />
              )}
            />
            <FormErrorMessage id="tagsError" error={errors.tags?.message} />
          </div>
        </div>
        <div className="text-right">
          <SubmitButton loading={isLoading}>Save Changes</SubmitButton>
        </div>
      </fieldset>
    </form>
  )
}

export default SeriesEditForm
