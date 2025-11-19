import { createClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/event-form'
import { redirect } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export async function EditEventContent({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/')
  }

  const { data: event, error: fetchError } = await supabase
    .from('events')
    .select(
      'id, name, sport_type, date_time, description, venues, created_at, updated_at, user_id',
    )
    .eq('id', id)
    .single()

  if (fetchError || !event) {
    console.error('Error fetching event:', fetchError)
    redirect('/')
  }

  if (event.user_id !== user.id) {
    redirect('/')
  }

  return (
    <div className="w-full max-w-2xl px-4">
      <EventForm event={event} />
    </div>
  )
}
