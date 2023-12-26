"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LessonSeries } from "@prisma/client"
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
  LessonCreateInputs,
  lessonCreateSchema,
} from "@/app/api/lessons/schema"

function LessonForm({ series }: { series: LessonSeries }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<LessonCreateInputs>({
    defaultValues: {
      lesson_series_id: series.id,
      title: "",
      scripture_references: [],
    },
    resolver: zodResolver(lessonCreateSchema),
  })

  const { isSubmitting, errors } = form.formState

  const handleDialogStateChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset()
    }

    setDialogOpen(isOpen)
  }

  const onError: SubmitErrorHandler<LessonCreateInputs> = (err) => {
    console.error(err)
  }

  const onSubmit: SubmitHandler<LessonCreateInputs> = async (values) => {
    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description: "The lesson was not created. Please try again.",
        variant: "destructive",
      })

      return
    }
    toast({
      title: "Success!",
      description: "The lesson was created successfully!",
      variant: "success",
    })

    router.refresh()
    form.reset()
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogStateChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="absolute right-2 top-2 text-xs"
        >
          + Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Lesson</DialogTitle>
          <DialogDescription>
            Add a lesson under <strong>{series.title}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <fieldset
            disabled={isSubmitting}
            className="space-y-6 disabled:pointer-events-none disabled:opacity-80"
          >
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Lesson title"
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
                  placeholder="Lesson description"
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
                <Label htmlFor="scripture_references">
                  Scripture References
                </Label>
                <Controller
                  control={form.control}
                  name="scripture_references"
                  render={({ field }) => (
                    <TagsInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Type a verse then press Enter"
                      aria-invalid={!!errors.scripture_references}
                      aria-describedby="srError"
                    />
                  )}
                />
                <FormErrorMessage
                  id="srError"
                  error={errors.scripture_references?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_url">File Url</Label>
                <Input
                  type="url"
                  id="file_url"
                  placeholder="File URL"
                  {...form.register("file_url")}
                  aria-invalid={!!errors.file_url}
                  aria-describedby="fileUrlError"
                />
                <FormErrorMessage
                  id="fileUrlError"
                  error={errors.file_url?.message}
                />
              </div>
            </div>
            <div className="text-right">
              <Button type="submit">
                {isSubmitting ? "Saving..." : "Save Lesson"}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LessonForm
