declare module 'mssql' {
  export interface SqlType {
    readonly type: string
  }

  export const Date: SqlType
  export const Int: SqlType

  export interface Request {
    input(name: string, type: SqlType, value: unknown): this
    query<T = Record<string, unknown>>(query: string): Promise<{ recordset: T[] }>
  }

  export interface ConnectionPool {
    request(): Request
    on(event: 'error', listener: (err: Error) => void): this
  }

  export function connect(config: {
    server: string
    database: string
    user: string
    password: string
    options?: {
      encrypt?: boolean
      trustServerCertificate?: boolean
    }
  }): Promise<ConnectionPool>

  const sql: {
    connect: typeof connect
    Date: typeof Date
    Int: typeof Int
  }

  export { sql }
  export default sql
}
