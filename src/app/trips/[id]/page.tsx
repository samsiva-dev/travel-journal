import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { TripModel } from '@/lib/models/Trip'
import DeleteTripButton from '@/components/DeleteTripButton'
import MarkdownPreview from '@/components/MarkdownPreview'
import type { Trip } from '@/types/trip'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥',
  AUD: 'A$', CAD: 'C$', INR: '₹', SGD: 'S$', THB: '฿',
}

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

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/signin')

  const trip = await getTrip(params.id)
  if (!trip) notFound()

  const isPlanned = trip.status === 'planned'
  const formattedDate = format(new Date(trip.tripDate), 'MMMM d, yyyy')
  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link
            href="/"
            className="text-journal-600 hover:text-journal-700 text-sm mb-3 inline-flex items-center gap-1"
          >
            ← All trips
          </Link>
          <h1 className="text-3xl font-bold text-journal-800">{trip.title}</h1>
          <p className="text-amber-700 font-medium mt-1">📍 {trip.destination}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/trips/${trip.id}/edit`}
            className="border border-journal-300 text-journal-700 px-4 py-2 rounded-xl hover:bg-journal-50 transition-colors text-sm font-medium"
          >
            Edit
          </Link>
          <DeleteTripButton id={trip.id} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <span
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium ${
                isPlanned ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isPlanned ? '🗓️ Planned' : '✅ Completed'}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {isPlanned ? 'Planned For' : 'Visited On'}
            </p>
            <p className="text-gray-900 font-medium">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {isPlanned ? 'Planned Budget' : 'Total Cost'}
            </p>
            <p className="text-gray-900 font-semibold text-xl">
              {trip.cost > 0 ? `${symbol}${trip.cost.toLocaleString()}` : '—'}
            </p>
          </div>
        </div>
      </div>

      {trip.content ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Notes</h2>
          <MarkdownPreview content={trip.content} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-400 text-sm">No notes yet.</p>
          <Link
            href={`/trips/${trip.id}/edit`}
            className="text-journal-600 hover:text-journal-700 text-sm mt-2 inline-block"
          >
            Add notes →
          </Link>
        </div>
      )}
    </div>
  )
}
