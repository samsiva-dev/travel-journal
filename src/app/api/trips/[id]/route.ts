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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const trip = await TripModel.findById(params.id)
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(serialize(trip))
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await connectDB()
  const trip = await TripModel.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(serialize(trip))
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const trip = await TripModel.findByIdAndDelete(params.id)
  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
