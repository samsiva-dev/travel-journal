'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteTripButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/trips/${id}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Deleting…' : 'Yes, delete'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
    >
      Delete
    </button>
  )
}
