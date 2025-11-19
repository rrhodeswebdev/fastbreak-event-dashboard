import { Suspense } from 'react'
import { BasicLoading } from '@/components/basic-loading'
import { EditEventContent } from '@/components/edit-event-content'
import { BackLink } from '@/components/back-link'

type Props = {
  params: Promise<{ id: string }>
}

export default function Page({ params }: Props) {
  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center pt-8">
      <BackLink href="/" label="Back to events" />
      <Suspense fallback={<BasicLoading />}>
        <EditEventContent params={params} />
      </Suspense>
    </div>
  )
}
