import { Spinner } from './ui/spinner'

export function BasicLoading() {
  return (
    <div className="flex items-center justify-center">
      <Spinner className="size-10" />
    </div>
  )
}
