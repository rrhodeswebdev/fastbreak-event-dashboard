'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Badge } from './ui/badge'
import type { Tables } from '@/types/database.types'
import { Calendar, MapPin, Trash2, Pencil } from 'lucide-react'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import { deleteEvent } from '@/actions/events'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { handleError, ErrorType } from '@/lib/error-handler'
import { toast } from 'sonner'
import { formatDateTimeForDisplay } from '@/lib/utils'
import { SUCCESS_MESSAGES } from '@/lib/constants'

type Props = { event: Tables<'events'> }

export function EventCard({ event }: Props) {
  const { date, time } = formatDateTimeForDisplay(event.date_time)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteEvent(event.id)

      if (result?.error) {
        handleError(result.error, {
          context: 'Deleting event',
          errorType: ErrorType.SERVER_ERROR,
        })
        setIsDeleting(false)
      } else if (result?.success) {
        toast.success(SUCCESS_MESSAGES.EVENT_DELETED)
      }
    } catch (error) {
      handleError(error, {
        context: 'Deleting event',
        customMessage: 'Failed to delete event',
        errorType: ErrorType.SERVER_ERROR,
      })
      setIsDeleting(false)
    }
  }

  const handleCardClick = () => {
    if (!isDeleting) {
      router.push(`/event/edit/${event.id}`)
    }
  }

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden relative cursor-pointer"
      onClick={handleCardClick}
    >
      {isDeleting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <Spinner className="size-8" />
        </div>
      )}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="flex flex-col items-center gap-2 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCardClick}
            disabled={isDeleting}
            className="h-12 w-12 bg-background/80 hover:bg-primary/20 text-foreground hover:text-foreground"
            aria-label="Edit event"
          >
            <Pencil className="h-6 w-6" />
          </Button>
          <span className="text-sm font-medium text-foreground bg-background/80 px-2 py-1 rounded">
            View/Edit
          </span>
        </div>
      </div>
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 w-8 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Delete event"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors pr-8">
            {event.name}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 mt-0.5">
            {event.sport_type}
          </Badge>
        </div>
        {event.description && (
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-medium text-foreground">{date}</span>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <span>{time}</span>
          </div>
        </div>
        {(event.venues?.length ?? 0) > 0 && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1.5">
              {event.venues?.map((venue, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground"
                >
                  {venue}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
