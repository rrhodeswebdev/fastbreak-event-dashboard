import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <div className="w-full max-w-2xl px-4">
      <Link
        href={href}
        className="text-sm underline underline-offset-4 flex flex-row items-center gap-2"
      >
        <ArrowLeft className="size-4" />
        {label}
      </Link>
    </div>
  )
}
