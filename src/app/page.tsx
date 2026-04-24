import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { TripModel } from '@/lib/models/Trip'
import TripCard from '@/components/TripCard'
import type { Trip } from '@/types/trip'

async function getTrips(): Promise<Trip[]> {
  await connectDB()
  const docs = await TripModel.find().sort({ createdAt: -1 })
  return docs.map(doc => ({
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
  }))
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const trips = await getTrips()
  const planned = trips.filter(t => t.status === 'planned')
  const completed = trips.filter(t => t.status === 'completed')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-journal-800">My Travel Journal</h1>
          <p className="text-gray-500 mt-1 text-sm">Document your adventures and future plans</p>
        </div>
        <Link
          href="/trips/new"
          className="bg-journal-600 text-white px-4 py-2.5 rounded-xl hover:bg-journal-700 transition-colors font-medium text-sm shadow-sm"
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🌏</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h2>
          <p className="text-gray-400 text-sm mb-6">Start documenting your adventures!</p>
          <Link
            href="/trips/new"
            className="inline-block bg-journal-600 text-white px-6 py-3 rounded-xl hover:bg-journal-700 transition-colors font-medium"
          >
            Add your first trip
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {planned.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-blue-800">🗓️ Upcoming Trips</h2>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                  {planned.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {planned.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-semibold text-emerald-800">✅ Past Adventures</h2>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {completed.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
