import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { env } from './env.js'
import { getPool, sql } from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/filiais', async (_req, res, next) => {
  try {
    const pool = await getPool()
    const result = await pool
      .request()
      .query(
        `SELECT ID_FILIAL AS id, RAZAOSOCIALFILIAL AS nome
         FROM dbo.FILIAIS
         WHERE ATIVO = 1
         ORDER BY RAZAOSOCIALFILIAL`,
      )

    res.json({ filiais: result.recordset })
  } catch (error) {
    next(error)
  }
})

const produtosQuerySchema = z.object({
  somenteCombustivel: z
    .union([z.literal('1'), z.literal('0'), z.literal('true'), z.literal('false')])
    .optional(),
})

app.get('/api/produtos', async (req, res, next) => {
  try {
    produtosQuerySchema.parse(req.query)

    const pool = await getPool()
    const result = await pool
      .request()
      .query(
        `SELECT ID_PRODUTOS AS id, NOMEPRODUTO AS nome
         FROM dbo.PRODUTOS
         WHERE ATIVO = 1
           AND ID_LOCALVENDAS = 1
         ORDER BY NOMEPRODUTO`,
      )

    res.json({ produtos: result.recordset })
  } catch (error) {
    next(error)
  }
})

const vendasQuerySchema = z.object({
  dataIni: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  dataFim: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  idFilial: z.coerce.number().int().positive().optional(),
  idProduto: z.coerce.number().int().positive().optional(),
})

type VendasRow = {
  ID_FILIAL: number
  NOMEFILIAL: string
  ID_PRODUTO: number
  NOMEPRODUTO: string
  DATA: Date | string
  VOLUME_LITROS: number
  VALOR_TOTAL_RS: number
}

app.get('/api/vendas', async (req, res, next) => {
  try {
    const { dataIni, dataFim, idFilial, idProduto } = vendasQuerySchema.parse(
      req.query,
    )

    const parsedDataIni = dataIni ? new Date(`${dataIni}T00:00:00Z`) : null
    const parsedDataFim = dataFim ? new Date(`${dataFim}T23:59:59Z`) : null

    const pool = await getPool()
    const request = pool.request()

    request.input('dataIni', sql.Date, parsedDataIni)
    request.input('dataFim', sql.Date, parsedDataFim)
    request.input('idFilial', sql.Int, idFilial ?? null)
    request.input('idProduto', sql.Int, idProduto ?? null)

    const result = await request.query<VendasRow>(`
      SELECT
        f.ID_FILIAL AS ID_FILIAL,
        f.RAZAOSOCIALFILIAL AS NOMEFILIAL,
        p.ID_PRODUTOS AS ID_PRODUTO,
        p.NOMEPRODUTO AS NOMEPRODUTO,
        CONVERT(date, l.DTACONTA) AS DATA,
        CAST(SUM(ISNULL(b.VENDAS, 0)) AS decimal(18,3)) AS VOLUME_LITROS,
        CAST(SUM(ISNULL(b.VENDAS, 0) * ISNULL(b.PPL, 0)) AS decimal(18,2)) AS VALOR_TOTAL_RS
      FROM dbo.LMCBICOS b
      INNER JOIN dbo.LMC l ON l.ID_LMC = b.ID_LMC
      INNER JOIN dbo.PRODUTOS p ON p.ID_PRODUTOS = l.ID_PRODUTOS
      INNER JOIN dbo.FILIAIS f ON f.ID_FILIAL = l.ID_FILIAL
      WHERE p.ATIVO = 1
        AND p.ID_LOCALVENDAS = 1
        AND ( @dataIni IS NULL OR CONVERT(date, l.DTACONTA) >= @dataIni )
        AND ( @dataFim IS NULL OR CONVERT(date, l.DTACONTA) <= @dataFim )
        AND ( @idFilial IS NULL OR f.ID_FILIAL = @idFilial )
        AND ( @idProduto IS NULL OR p.ID_PRODUTOS = @idProduto )
      GROUP BY
        f.ID_FILIAL,
        f.RAZAOSOCIALFILIAL,
        p.ID_PRODUTOS,
        p.NOMEPRODUTO,
        CONVERT(date, l.DTACONTA)
      ORDER BY DATA, NOMEFILIAL, NOMEPRODUTO;
    `)

    const vendas = result.recordset.map((row) => {
      const dataValue =
        row.DATA instanceof Date
          ? row.DATA.toISOString().slice(0, 10)
          : String(row.DATA)

      return {
        data: dataValue,
        idFilial: row.ID_FILIAL,
        nomeFilial: row.NOMEFILIAL,
        idProduto: row.ID_PRODUTO,
        nomeProduto: row.NOMEPRODUTO,
        volumeLitros: Number(row.VOLUME_LITROS),
        valorTotal: Number(row.VALOR_TOTAL_RS),
      }
    })

    res.json({ vendas })
  } catch (error) {
    next(error)
  }
})

app.use(
  (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid request parameters',
        issues: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    console.error(err.message)
    res.status(500).json({ message: 'Internal server error' })
  },
)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})
