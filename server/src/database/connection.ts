import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

export const connection = new PrismaClient({
  log: process.env.ENV === 'dev' ? ['query'] : [],
})
