'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createEvent, updateEvent } from '@/actions/events'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/types/database.types'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Event name must be at least 3 characters.',
  }),
  sport_type: z.string().min(1, {
    message: 'Please select a sport type.',
  }),
  date_time: z.string().min(1, {
    message: 'Please select a date and time.',
  }),
  description: z.string().optional(),
  venues: z.string().optional(),
})

type EventFormProps = {
  event?: Tables<'events'>
}

export function EventForm({ event }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const isEditMode = !!event

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sport_type: '',
      date_time: '',
      description: '',
      venues: '',
    },
  })

  useEffect(() => {
    if (event) {
      const formatDateTimeLocal = (isoString: string) => {
        const date = new Date(isoString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      form.reset({
        name: event.name,
        sport_type: event.sport_type,
        date_time: formatDateTimeLocal(event.date_time),
        description: event.description || '',
        venues: event.venues ? event.venues.join(', ') : '',
      })
    }
  }, [event, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const venuesArray = values.venues
        ? values.venues
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean)
        : undefined

      const localDate = new Date(values.date_time)
      const dateTimeISO = localDate.toISOString()

      const formData = {
        name: values.name,
        sport_type: values.sport_type,
        date_time: dateTimeISO,
        description: values.description,
        venues: venuesArray,
      }

      let result
      if (isEditMode && event) {
        result = await updateEvent(event.id, formData)
      } else {
        result = await createEvent(formData)
      }

      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        setIsSubmitting(false)
      } else if (result?.success) {
        if (!isEditMode) {
          form.reset()
        }
        toast.success(
          isEditMode ? 'Event updated successfully!' : 'Event created successfully!'
        )
        setIsSubmitting(false)
        router.push('/')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Event' : 'Create New Event'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Update the details below to edit this event.'
            : 'Fill in the details below to create a new sports event.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Summer Basketball Tournament"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give your event a descriptive name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="sport_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport Type</FormLabel>
                    <Select
                      key={field.value || 'empty'}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basketball">Basketball</SelectItem>
                        <SelectItem value="Soccer">Soccer</SelectItem>
                        <SelectItem value="Baseball">Baseball</SelectItem>
                        <SelectItem value="Football">Football</SelectItem>
                        <SelectItem value="Volleyball">Volleyball</SelectItem>
                        <SelectItem value="Tennis">Tennis</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of sport for this event.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date and Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormDescription>
                      When will the event take place?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional details about the event..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any additional information about the event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="venues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venues (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Court 1, Court 2, Main Arena"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter venue names separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Updating Event...'
                  : 'Creating Event...'
                : isEditMode
                  ? 'Update Event'
                  : 'Create Event'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
