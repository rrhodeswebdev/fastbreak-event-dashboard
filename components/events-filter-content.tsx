import { EventsFilter } from '@/components/events-filter'

type Props = {
  searchParams: Promise<{
    name?: string
    sport?: string
  }>
}

export async function EventsFilterContent({ searchParams }: Props) {
  const params = await searchParams
  const nameFilter = params.name || ''
  const sportFilter = params.sport || ''

  return <EventsFilter initialName={nameFilter} initialSport={sportFilter} />
}

