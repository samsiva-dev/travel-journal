export type TripStatus = 'planned' | 'completed'

export interface Trip {
  id: string
  title: string
  destination: string
  status: TripStatus
  tripDate: string
  cost: number
  currency: string
  content: string
  createdAt: string
  updatedAt: string
}

export type CreateTripInput = {
  title: string
  destination: string
  status: TripStatus
  tripDate: string
  cost: number
  currency: string
  content: string
}

export type UpdateTripInput = Partial<CreateTripInput>
