import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { TripModel } from '@/lib/models/Trip'
import TripForm from '@/components/TripForm'
import type { Trip } from '@/types/trip'

async function getTrip(id: string): Promise<Trip | null> {
  try {
    await connectDB()
    const doc = await TripModel.findById(id)
    if (!doc) return null
    return {
      id: doc._id.toString(),
      title: doc.title,
      destination: doc.destination,
      status: doc.status,
      tripDate: doc.tripDate,
      cost: doc.cost,
      currency: doc.currency,
      content: doc.content,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }
  } catch {
    return null
  }
}

export default async function EditTripPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const trip = await getTrip(params.id)
  if (!trip) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/trips/${trip.id}`}
          className="text-journal-600 hover:text-journal-700 text-sm mb-3 inline-flex items-center gap-1"
        >
          ← Back to trip
        </Link>
        <h1 className="text-2xl font-bold text-journal-800">Edit Trip</h1>
        <p className="text-gray-500 text-sm mt-1">{trip.destination}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <TripForm trip={trip} isEditing />
      </div>
    </div>
  )
}
