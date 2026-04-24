'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const params = useSearchParams()
  const error = params.get('error')

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-10 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm mb-8">
          {error === 'AccessDenied'
            ? 'This journal is private and only accessible to its owner.'
            : 'Something went wrong during sign in.'}
        </p>
        <Link
          href="/auth/signin"
          className="inline-block bg-journal-600 text-white px-6 py-2.5 rounded-xl hover:bg-journal-700 transition-colors font-medium text-sm"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
