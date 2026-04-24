import mongoose from 'mongoose'

let cached = global._mongoose

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables')

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  return cached.conn
}
