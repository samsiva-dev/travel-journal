'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-journal-700 hover:text-journal-800">
          <span>🌍</span>
          <span>Travel Journal</span>
        </Link>

        {session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'User'}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-amber-200"
              />
            )}
            <span className="text-sm text-gray-600 hidden sm:block">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
