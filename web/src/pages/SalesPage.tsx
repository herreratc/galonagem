import { useEffect, useMemo, useState } from 'react'
import { ExportButtons } from '../components/ExportButtons'
import { FiltersBar } from '../components/FiltersBar'
import { SalesTable } from '../components/SalesTable'
import { SummaryCards } from '../components/SummaryCards'
import { fetchFiliais, fetchProdutos, fetchVendas } from '../services/api'
import type { Filters, Filial, Produto, Venda } from '../types'

function formatDate(input: Date) {
  return input.toISOString().slice(0, 10)
}

const today = new Date()
const lastWeek = new Date()
lastWeek.setDate(today.getDate() - 7)

const initialFilters: Filters = {
  dataIni: formatDate(lastWeek),
  dataFim: formatDate(today),
  idFilial: '',
  idProduto: '',
}

export function SalesPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters)
  const [filiais, setFiliais] = useState<Filial[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [filiaisResponse, produtosResponse] = await Promise.all([
          fetchFiliais(),
          fetchProdutos(),
        ])
        setFiliais(filiaisResponse)
        setProdutos(produtosResponse)
      } catch (err) {
        setError('Não foi possível carregar filiais e produtos')
      }
    }

    loadMetadata()
  }, [])

  useEffect(() => {
    async function loadVendas() {
      setLoading(true)
      setError(null)
      try {
        const vendasResponse = await fetchVendas(appliedFilters)
        setVendas(vendasResponse)
      } catch (err) {
        setError('Não foi possível carregar as vendas')
      } finally {
        setLoading(false)
      }
    }

    loadVendas()
  }, [appliedFilters])

  const totals = useMemo(() => {
    const totalVolume = vendas.reduce((sum, venda) => sum + venda.volumeLitros, 0)
    const totalValue = vendas.reduce((sum, venda) => sum + venda.valorTotal, 0)
    const ticketMedio = totalVolume ? totalValue / totalVolume : 0

    return { totalVolume, totalValue, ticketMedio }
  }, [vendas])

  const selectedFilialName = useMemo(() => {
    if (!appliedFilters.idFilial) return 'Todas'
    return filiais.find((f) => f.id === Number(appliedFilters.idFilial))?.nome || 'Filial'
  }, [appliedFilters.idFilial, filiais])

  const selectedProdutoName = useMemo(() => {
    if (!appliedFilters.idProduto) return 'Todos'
    return produtos.find((p) => p.id === Number(appliedFilters.idProduto))?.nome || 'Produto'
  }, [appliedFilters.idProduto, produtos])

  const handleApplyFilters = () => {
    setAppliedFilters(filters)
  }

  return (
    <main className="page">
      <FiltersBar
        filters={filters}
        filiais={filiais}
        produtos={produtos}
        onChange={setFilters}
        onApply={handleApplyFilters}
        loading={loading}
      />

      <SummaryCards
        totalVolume={totals.totalVolume}
        totalValue={totals.totalValue}
        ticketMedio={totals.ticketMedio}
      />

      <div className="card">
        <div className="card-header">
          <div>
            <p className="overline">Vendas</p>
            <h2 className="card-title">Resultados</h2>
          </div>
          <ExportButtons
            vendas={vendas}
            filters={appliedFilters}
            filialLabel={selectedFilialName}
            produtoLabel={selectedProdutoName}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
      </div>

      <SalesTable vendas={vendas} loading={loading} />
    </main>
  )
}
