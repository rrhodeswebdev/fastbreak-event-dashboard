import type { Tables } from '@/types/database.types'
import { createClient } from '@/lib/supabase/server'
import { EventCard } from './event-card'
import { cacheLife } from 'next/cache'

type Event = Tables<'events'>

export async function EventsList() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, sport_type, date_time, description, venues, created_at, updated_at, user_id',
    )
    .order('updated_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading events</div>
  }

  const events: Event[] = data ?? []

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-muted-foreground text-center">
          No events found. Create your first event to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}
