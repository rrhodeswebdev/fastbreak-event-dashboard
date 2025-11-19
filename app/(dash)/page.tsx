import { Suspense } from 'react'
import Link from 'next/link'
import { BasicLoading } from '@/components/basic-loading'
import { EventsContent } from '@/components/events-content'
import { EventsFilterContent } from '@/components/events-filter-content'

type Props = {
  searchParams: Promise<{
    name?: string
    sport?: string
  }>
}

export default function Home({ searchParams }: Props) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
        <div className="w-full max-w-5xl px-4 flex flex-col gap-4">
          <Link
            href="/event/new"
            className="max-w-fit bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Create Event
          </Link>
          <Suspense fallback={<div className="h-20" />}>
            <EventsFilterContent searchParams={searchParams} />
          </Suspense>
        </div>
        <Suspense fallback={<BasicLoading />}>
          <EventsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}
