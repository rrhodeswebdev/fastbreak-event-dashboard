import { EventForm } from '@/components/event-form'
import { BackLink } from '@/components/back-link'

export default function Page() {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
      <BackLink href="/" label="Back to events" />
      <div className="w-full max-w-2xl px-4">
        <EventForm />
      </div>
    </div>
  )
}
