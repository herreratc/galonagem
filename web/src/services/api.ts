import { Filters, Filial, Produto, Venda } from '../types'

const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

async function request<T>(path: string, params?: URLSearchParams) {
  const url = params ? `${baseUrl}${path}?${params.toString()}` : `${baseUrl}${path}`
  const response = await fetch(url)

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Falha ao buscar dados')
  }

  return (await response.json()) as T
}

export async function fetchFiliais() {
  const data = await request<{ filiais: Filial[] }>('/api/filiais')
  return data.filiais
}

export async function fetchProdutos() {
  const data = await request<{ produtos: Produto[] }>(
    '/api/produtos',
    new URLSearchParams({ somenteCombustivel: '1' }),
  )
  return data.produtos
}

export async function fetchVendas(filters: Filters) {
  const params = new URLSearchParams()

  if (filters.dataIni) params.set('dataIni', filters.dataIni)
  if (filters.dataFim) params.set('dataFim', filters.dataFim)
  if (filters.idFilial) params.set('idFilial', filters.idFilial)
  if (filters.idProduto) params.set('idProduto', filters.idProduto)

  const data = await request<{ vendas: Venda[] }>('/api/vendas', params)
  return data.vendas
}
