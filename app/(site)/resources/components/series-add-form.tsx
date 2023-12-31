"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import FormErrorMessage from "@/components/ui/form-error-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import TagsInput from "@/components/tags-input"
import {
  LessonSeriesCreateInputs,
  seriesCreateSchema,
} from "@/app/api/series/schema"

function SeriesAddForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<LessonSeriesCreateInputs>({
    resolver: zodResolver(seriesCreateSchema),
    defaultValues: {
      tags: [],
    },
  })

  const { errors } = form.formState

  const onError: SubmitErrorHandler<LessonSeriesCreateInputs> = (
    formErrors
  ) => {
    console.error("Lesson Series Errors: ", formErrors)
  }

  const onSubmit: SubmitHandler<LessonSeriesCreateInputs> = async (values) => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response?.ok) {
        toast({
          title: "Something went wrong.",
          description: "The lesson series was not created. Please try again.",
          variant: "destructive",
        })

        return
      }
      toast({
        title: "Success!",
        description: "The lesson series was created successfully!",
        variant: "success",
      })

      router.refresh()
      form.reset()
      setDialogOpen(false)
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-3 h-4 w-4" />
          <span>Add Series</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Series</DialogTitle>
          <DialogDescription>Add a Lesson Series</DialogDescription>
        </DialogHeader>
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
                <FormErrorMessage
                  id="titleError"
                  error={errors.title?.message}
                />
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
              <Button type="submit">
                {isLoading ? "Saving..." : "Save Series"}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SeriesAddForm
