import { ChangeEvent } from 'react'
import type { Filters, Filial, Produto } from '../types'

interface FiltersBarProps {
  filters: Filters
  filiais: Filial[]
  produtos: Produto[]
  onChange: (filters: Filters) => void
  onApply: () => void
  loading: boolean
}

export function FiltersBar({
  filters,
  filiais,
  produtos,
  onChange,
  onApply,
  loading,
}: FiltersBarProps) {
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    onChange({ ...filters, [name]: value })
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <p className="overline">Filtros</p>
          <h2 className="card-title">Vendas de combustíveis</h2>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={onApply}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Aplicar filtros'}
        </button>
      </div>
      <div className="filters-grid">
        <label className="field">
          <span>Data início</span>
          <input
            type="date"
            name="dataIni"
            value={filters.dataIni}
            onChange={handleInputChange}
            max={filters.dataFim}
          />
        </label>
        <label className="field">
          <span>Data fim</span>
          <input
            type="date"
            name="dataFim"
            value={filters.dataFim}
            onChange={handleInputChange}
            min={filters.dataIni}
          />
        </label>
        <label className="field">
          <span>Filial</span>
          <select
            name="idFilial"
            value={filters.idFilial}
            onChange={handleInputChange}
          >
            <option value="">Todas</option>
            {filiais.map((filial) => (
              <option key={filial.id} value={filial.id}>
                {filial.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Produto</span>
          <select
            name="idProduto"
            value={filters.idProduto}
            onChange={handleInputChange}
          >
            <option value="">Todos</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
