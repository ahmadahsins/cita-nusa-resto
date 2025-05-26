import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Query ringan ke database
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'ok', db: 'connected' })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ status: 'error', db: 'disconnected' })
  } finally {
    await prisma.$disconnect()
  }
}