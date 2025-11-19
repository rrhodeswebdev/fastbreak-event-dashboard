'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { TablesInsert } from '@/types/database.types'
import { getAuthenticatedUser, verifyEventOwnership } from '@/lib/auth-helpers'
import { ERROR_MESSAGES } from '@/lib/constants'

export async function createEvent(formData: {
  name: string
  sport_type: string
  date_time: string
  description?: string
  venues?: string[]
}) {
  const { user, error: authError } = await getAuthenticatedUser()

  if (authError || !user) {
    return {
      error: `${ERROR_MESSAGES.AUTH_REQUIRED} to create an event`,
    }
  }

  const supabase = await createClient()

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
      error: error.message || ERROR_MESSAGES.EVENT_CREATE_FAILED,
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
  const { user, error: authError } = await getAuthenticatedUser()

  if (authError || !user) {
    return {
      error: `${ERROR_MESSAGES.AUTH_REQUIRED} to update an event`,
    }
  }

  const { authorized, error: ownershipError } = await verifyEventOwnership(
    eventId,
    user.id,
  )

  if (!authorized || ownershipError) {
    return {
      error: ownershipError || ERROR_MESSAGES.PERMISSION_DENIED,
    }
  }

  const supabase = await createClient()

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
      error: error.message || ERROR_MESSAGES.EVENT_UPDATE_FAILED,
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
  const { user, error: authError } = await getAuthenticatedUser()

  if (authError || !user) {
    return {
      error: `${ERROR_MESSAGES.AUTH_REQUIRED} to delete an event`,
    }
  }

  const { authorized, error: ownershipError } = await verifyEventOwnership(
    eventId,
    user.id,
  )

  if (!authorized || ownershipError) {
    return {
      error: ownershipError || ERROR_MESSAGES.PERMISSION_DENIED,
    }
  }

  const supabase = await createClient()

  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (deleteError) {
    console.error('Error deleting event:', deleteError)
    return {
      error: deleteError.message || ERROR_MESSAGES.EVENT_DELETE_FAILED,
    }
  }

  revalidatePath('/', 'page')

  return {
    success: true,
  }
}
