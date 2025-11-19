import type { Tables } from '@/types/database.types'
import { createClient } from '@/lib/supabase/server'
import { EventCard } from './event-card'
import { EVENT_SELECT_FIELDS } from '@/lib/constants'

type Event = Tables<'events'>

type Props = {
  nameFilter?: string
  sportFilter?: string
}

export async function EventsList({ nameFilter, sportFilter }: Props) {
  const supabase = await createClient()

  let query = supabase.from('events').select(EVENT_SELECT_FIELDS)

  if (nameFilter) {
    query = query.ilike('name', `%${nameFilter}%`)
  }

  if (sportFilter) {
    query = query.eq('sport_type', sportFilter)
  }

  const { data, error } = await query.order('updated_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div>Error loading events</div>
  }

  const events: Event[] = data ?? []

  if (events.length === 0) {
    const hasFilters = nameFilter || sportFilter
    
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <p className="text-muted-foreground text-center">
          {hasFilters
            ? 'No events found matching your filters. Try adjusting your search criteria.'
            : 'No events found. Create your first event to get started!'}
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
