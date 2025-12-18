import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  SQLSERVER_HOST: z.string().min(1, 'SQLSERVER_HOST is required'),
  SQLSERVER_DB: z.string().min(1, 'SQLSERVER_DB is required'),
  SQLSERVER_USER: z.string().min(1, 'SQLSERVER_USER is required'),
  SQLSERVER_PASSWORD: z.string().min(1, 'SQLSERVER_PASSWORD is required'),
  SQLSERVER_ENCRYPT: z.coerce.boolean().default(false),
  SQLSERVER_TRUST_CERT: z.coerce.boolean().default(false),
  PORT: z.coerce.number().int().positive().default(3001),
})

export const env = envSchema.parse({
  SQLSERVER_HOST: process.env.SQLSERVER_HOST,
  SQLSERVER_DB: process.env.SQLSERVER_DB,
  SQLSERVER_USER: process.env.SQLSERVER_USER,
  SQLSERVER_PASSWORD: process.env.SQLSERVER_PASSWORD,
  SQLSERVER_ENCRYPT: process.env.SQLSERVER_ENCRYPT,
  SQLSERVER_TRUST_CERT: process.env.SQLSERVER_TRUST_CERT,
  PORT: process.env.PORT,
})
