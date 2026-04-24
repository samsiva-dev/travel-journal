import mongoose, { Schema, Document, Model } from 'mongoose'
import type { TripStatus } from '@/types/trip'

export interface TripDocument extends Document {
  title: string
  destination: string
  status: TripStatus
  tripDate: string
  cost: number
  currency: string
  content: string
  createdAt: Date
  updatedAt: Date
}

const TripSchema = new Schema<TripDocument>(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    status: { type: String, enum: ['planned', 'completed'], required: true },
    tripDate: { type: String, required: true },
    cost: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD' },
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

export const TripModel: Model<TripDocument> =
  (mongoose.models.Trip as Model<TripDocument>) ||
  mongoose.model<TripDocument>('Trip', TripSchema)
