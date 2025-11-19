import { createClient } from '@/lib/supabase/server'

export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { user: null, error: 'Authentication required' }
  }

  return { user, error: null }
}

export async function verifyEventOwnership(eventId: string, userId: string) {
  const supabase = await createClient()

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select('user_id')
    .eq('id', eventId)
    .single()

  if (fetchError) {
    console.error('Error fetching event:', fetchError)
    return { authorized: false, error: 'Event not found' }
  }

  if (event.user_id !== userId) {
    return {
      authorized: false,
      error: "You don't have permission to modify this event",
    }
  }

  return { authorized: true, error: null }
}
