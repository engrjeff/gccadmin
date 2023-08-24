"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { useLessonFormSheetStore } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

function LessonForm() {
  const formState = useLessonFormSheetStore()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formState.setSelectedSeries(null)
    }

    formState.toggle(isOpen)
  }

  return (
    <Dialog open={formState.shown} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Lesson</DialogTitle>
          <DialogDescription>
            Add a lesson under{" "}
            <strong>{formState.selectedSeries?.title}</strong>
          </DialogDescription>
        </DialogHeader>
        <Form />
      </DialogContent>
    </Dialog>
  )
}

const Form = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { closeForm, selectedSeries, setSelectedSeries } =
    useLessonFormSheetStore()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const values = Object.fromEntries(formData.entries())

    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        scripture_references: values.scripture_references
          ? String(values.scripture_references)
              .split(",")
              .map((s) => s.trim())
          : [],
      }),
    })

    setIsLoading(false)

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
    closeForm()
    router.refresh()

    setSelectedSeries(null)
  }

  return (
    <form
      className={cn("space-y-6", {
        "pointer-events-none opacity-80": isLoading,
      })}
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        <input
          type="hidden"
          name="lesson_series_id"
          defaultValue={selectedSeries?.id}
        />
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" placeholder="Lesson title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Lesson description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scripture_references">Scripture References</Label>
          <Textarea
            id="scripture_references"
            name="scripture_references"
            placeholder="Enter comma-separated values like John 3:16,Romans 6:23"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="file_url">File Url</Label>
          <Input
            type="url"
            id="file_url"
            name="file_url"
            placeholder="File URL"
          />
        </div>
      </div>
      <div className="text-right">
        <Button type="submit">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

export default LessonForm
