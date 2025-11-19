'use client'

import { Input } from './ui/input'
import { Search, X } from 'lucide-react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

type Props = {
  initialName: string
  initialSport: string
}

const SPORT_TYPES = [
  'Basketball',
  'Soccer',
  'Football',
  'Baseball',
  'Volleyball',
  'Tennis',
  'Hockey',
  'Other',
]

export function EventsFilter({ initialName, initialSport }: Props) {
  const router = useRouter()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const sportSelectRef = useRef<HTMLSelectElement>(null)
  const hasActiveFilters = initialName || initialSport

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.value = initialName
    }
    if (sportSelectRef.current) {
      sportSelectRef.current.value = initialSport || ''
    }
  }, [initialName, initialSport])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const sport = formData.get('sport') as string

    const params = new URLSearchParams()
    if (name) params.set('name', name)
    if (sport) params.set('sport', sport)

    router.push(`/?${params.toString()}`)
  }

  const handleClear = () => {
    if (nameInputRef.current) nameInputRef.current.value = ''
    if (sportSelectRef.current) sportSelectRef.current.value = ''
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full bg-card border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={nameInputRef}
              id="name-filter"
              name="name"
              type="text"
              placeholder="Search events..."
              defaultValue={initialName}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex-1">
          <select
            ref={sportSelectRef}
            id="sport-filter"
            name="sport"
            defaultValue={initialSport || ''}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">All sports</option>
            {SPORT_TYPES.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

