import { EventsList } from '@/components/events-list'

type Props = {
  searchParams: Promise<{
    name?: string
    sport?: string
  }>
}

export async function EventsContent({ searchParams }: Props) {
  const params = await searchParams
  const nameFilter = params.name || ''
  const sportFilter = params.sport || ''

  return <EventsList nameFilter={nameFilter} sportFilter={sportFilter} />
}

