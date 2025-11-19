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
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/types/database.types'
import { handleError, ErrorType } from '@/lib/error-handler'
import { toast } from 'sonner'
import { SPORT_TYPES, SUCCESS_MESSAGES } from '@/lib/constants'
import {
  formatDateTimeForInput,
  venuesStringToArray,
  venuesArrayToString,
} from '@/lib/utils'

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
    defaultValues: event
      ? {
          name: event.name,
          sport_type: event.sport_type,
          date_time: formatDateTimeForInput(event.date_time),
          description: event.description || '',
          venues: venuesArrayToString(event.venues),
        }
      : {
          name: '',
          sport_type: '',
          date_time: '',
          description: '',
          venues: '',
        },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError(null)

    try {
      const venuesArray = venuesStringToArray(values.venues)

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
        const errorResponse = handleError(result.error, {
          context: isEditMode ? 'Updating event' : 'Creating event',
          errorType: ErrorType.SERVER_ERROR,
        })
        setError(errorResponse.message)
        setIsSubmitting(false)
      } else if (result?.success) {
        if (!isEditMode) {
          form.reset()
        }
        toast.success(
          isEditMode ? SUCCESS_MESSAGES.EVENT_UPDATED : SUCCESS_MESSAGES.EVENT_CREATED
        )
        setIsSubmitting(false)
        router.push('/')
      }
    } catch (err) {
      const errorResponse = handleError(err, {
        context: isEditMode ? 'Updating event' : 'Creating event',
        errorType: ErrorType.SERVER_ERROR,
      })
      setError(errorResponse.message)
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPORT_TYPES.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
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
