'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert } from '@/types/database.types'

export async function createEvent(formData: {
  name: string
  sport_type: string
  date_time: string
  description?: string
  venues?: string[]
}) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      error: 'You must be logged in to create an event',
    }
  }

  const eventData: TablesInsert<'events'> = {
    name: formData.name,
    sport_type: formData.sport_type,
    date_time: formData.date_time,
    description: formData.description || null,
    venues: formData.venues || null,
    user_id: user.id,
  }

  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return {
      error: error.message || 'Failed to create event',
    }
  }

  revalidatePath('/', 'page')

  return {
    success: true,
    data,
  }
}

export async function updateEvent(
  eventId: string,
  formData: {
    name: string
    sport_type: string
    date_time: string
    description?: string
    venues?: string[]
  },
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      error: 'You must be logged in to update an event',
    }
  }

  // First, verify the event exists and belongs to the user
  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('user_id')
    .eq('id', eventId)
    .single()

  if (fetchError) {
    console.error('Error fetching event:', fetchError)
    return {
      error: 'Event not found',
    }
  }

  if (event.user_id !== user.id) {
    return {
      error: "You don't have permission to update this event",
    }
  }

  // Update the event
  const { data, error } = await supabase
    .from('events')
    .update({
      name: formData.name,
      sport_type: formData.sport_type,
      date_time: formData.date_time,
      description: formData.description || null,
      venues: formData.venues || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    return {
      error: error.message || 'Failed to update event',
    }
  }

  revalidatePath('/', 'page')
  revalidatePath(`/event/edit/${eventId}`, 'page')

  return {
    success: true,
    data,
  }
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      error: 'You must be logged in to delete an event',
    }
  }

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('user_id')
    .eq('id', eventId)
    .single()

  if (fetchError) {
    console.error('Error fetching event:', fetchError)
    return {
      error: 'Event not found',
    }
  }

  if (event.user_id !== user.id) {
    return {
      error: "You don't have permission to delete this event",
    }
  }

  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (deleteError) {
    console.error('Error deleting event:', deleteError)
    return {
      error: deleteError.message || 'Failed to delete event',
    }
  }

  revalidatePath('/', 'page')

  return {
    success: true,
  }
}
