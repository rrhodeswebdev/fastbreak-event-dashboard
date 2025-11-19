import { EnvVarWarning } from '@/components/env-var-warning'
import { AuthButton } from '@/components/auth-button'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { hasEnvVars } from '@/lib/utils'
import Link from 'next/link'
import { Suspense } from 'react'

type Props = {
  children: React.ReactNode
}

export default function DashLayout({ children }: Props) {
  return (
    <>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={'/'}>Fastbreak Events</Link>
          </div>
          <div className="flex flex-row gap-2 items-center justify-center">
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
            <ThemeSwitcher />
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}
