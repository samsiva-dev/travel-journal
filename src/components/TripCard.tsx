import Link from 'next/link'
import { format } from 'date-fns'
import type { Trip } from '@/types/trip'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥',
  AUD: 'A$', CAD: 'C$', INR: '₹', SGD: 'S$', THB: '฿',
}

export default function TripCard({ trip }: { trip: Trip }) {
  const isPlanned = trip.status === 'planned'
  const dateLabel = isPlanned ? 'Planned for' : 'Visited on'
  const formattedDate = format(new Date(trip.tripDate), 'MMM d, yyyy')
  const symbol = CURRENCY_SYMBOLS[trip.currency] ?? trip.currency

  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-journal-700 transition-colors">
              {trip.title}
            </h3>
            <p className="text-amber-700 text-sm mt-0.5 truncate">📍 {trip.destination}</p>
          </div>
          <span
            className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
              isPlanned ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isPlanned ? 'Upcoming' : 'Completed'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>📅 {dateLabel}: {formattedDate}</span>
          {trip.cost > 0 && (
            <span className="font-medium text-gray-700">
              {symbol}{trip.cost.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
