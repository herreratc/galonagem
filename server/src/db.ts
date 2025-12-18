import sql, { ConnectionPool } from 'mssql'
import { env } from './env.js'

let poolPromise: Promise<ConnectionPool> | null = null

export async function getPool() {
  if (!poolPromise) {
    poolPromise = sql
      .connect({
        server: env.SQLSERVER_HOST,
        database: env.SQLSERVER_DB,
        user: env.SQLSERVER_USER,
        password: env.SQLSERVER_PASSWORD,
        options: {
          encrypt: env.SQLSERVER_ENCRYPT,
          trustServerCertificate: env.SQLSERVER_TRUST_CERT,
        },
      })
      .then((pool) => {
        pool.on('error', (err) => {
          console.error('MSSQL pool error', err.message)
        })
        return pool
      })
      .catch((err) => {
        poolPromise = null
        throw err
      })
  }

  return poolPromise
}

export { sql }
