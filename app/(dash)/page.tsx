import Link from 'next/link'
import { Suspense } from 'react'
import { BasicLoading } from '@/components/basic-loading'
import { EventsList } from '@/components/events-list'

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
        <div className="w-full max-w-5xl px-4">
          <Link
            href="/event/new"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Create Event
          </Link>
        </div>
        <Suspense fallback={<BasicLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </main>
  )
}
