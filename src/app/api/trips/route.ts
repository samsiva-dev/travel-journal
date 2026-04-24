import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { TripModel } from '@/lib/models/Trip'
import type { Trip } from '@/types/trip'

function serialize(doc: InstanceType<typeof TripModel>): Trip {
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
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const trips = await TripModel.find().sort({ createdAt: -1 })
  return NextResponse.json(trips.map(serialize))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()
  const trip = await TripModel.create(body)
  return NextResponse.json(serialize(trip), { status: 201 })
}
