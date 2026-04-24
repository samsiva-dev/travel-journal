'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Trip, TripStatus } from '@/types/trip'
import MarkdownPreview from './MarkdownPreview'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'SGD', 'THB']

interface TripFormProps {
  trip?: Trip
  isEditing?: boolean
}

export default function TripForm({ trip, isEditing }: TripFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const [title, setTitle] = useState(trip?.title ?? '')
  const [destination, setDestination] = useState(trip?.destination ?? '')
  const [status, setStatus] = useState<TripStatus>(trip?.status ?? 'planned')
  const [tripDate, setTripDate] = useState(trip?.tripDate?.slice(0, 10) ?? '')
  const [cost, setCost] = useState(trip?.cost?.toString() ?? '0')
  const [currency, setCurrency] = useState(trip?.currency ?? 'USD')
  const [content, setContent] = useState(trip?.content ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEditing ? `/api/trips/${trip!.id}` : '/api/trips'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          destination,
          status,
          tripDate,
          cost: parseFloat(cost) || 0,
          currency,
          content,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const saved = await res.json()
      router.push(`/trips/${saved.id}`)
      router.refresh()
    } catch {
      setError('Failed to save trip. Please try again.')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Summer in Kyoto"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            required
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="e.g. Kyoto, Japan"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as TripStatus)}
            className={inputClass}
          >
            <option value="planned">Planned (Upcoming)</option>
            <option value="completed">Completed (Past)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {status === 'planned' ? 'Planned Date' : 'Date Visited'}
          </label>
          <input
            type="date"
            required
            value={tripDate}
            onChange={e => setTripDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {CURRENCIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="1"
              value={cost}
              onChange={e => setCost(e.target.value)}
              className={inputClass}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-100 bg-gray-50">
            {(['write', 'preview'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? 'text-journal-700 border-b-2 border-journal-600 bg-white -mb-px'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 'write' ? (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={14}
              placeholder="Write your trip notes in markdown..."
              className="w-full px-4 py-3 text-sm focus:outline-none resize-y font-mono leading-relaxed"
            />
          ) : (
            <div className="px-4 py-3 min-h-[200px]">
              {content ? (
                <MarkdownPreview content={content} />
              ) : (
                <p className="text-gray-400 italic text-sm">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">Supports Markdown formatting</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-journal-600 text-white px-6 py-2 rounded-lg hover:bg-journal-700 transition-colors disabled:opacity-50 font-medium text-sm"
        >
          {loading ? 'Saving…' : isEditing ? 'Update Trip' : 'Create Trip'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
