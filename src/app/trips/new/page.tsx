import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import TripForm from '@/components/TripForm'
import Link from 'next/link'

export default async function NewTripPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  return (
    <div>
      <div className="mb-6">
        <Link href="/" className="text-journal-600 hover:text-journal-700 text-sm mb-3 inline-flex items-center gap-1">
          ← All trips
        </Link>
        <h1 className="text-2xl font-bold text-journal-800">New Trip</h1>
        <p className="text-gray-500 text-sm mt-1">Log a past adventure or plan a future one</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <TripForm />
      </div>
    </div>
  )
}
