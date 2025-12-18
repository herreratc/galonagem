import type { Venda } from '../types'

interface SalesTableProps {
  vendas: Venda[]
  loading: boolean
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const volumeFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' })

export function SalesTable({ vendas, loading }: SalesTableProps) {
  if (loading) {
    return (
      <div className="card">
        <p>Carregando vendas...</p>
      </div>
    )
  }

  if (!vendas.length) {
    return (
      <div className="card">
        <p>Nenhuma venda encontrada para o período selecionado.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Filial</th>
              <th>Produto</th>
              <th className="numeric">Volume (L)</th>
              <th className="numeric">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={`${venda.data}-${venda.idFilial}-${venda.idProduto}`}>
                <td>{dateFormatter.format(new Date(`${venda.data}T00:00:00Z`))}</td>
                <td>{venda.nomeFilial}</td>
                <td>{venda.nomeProduto}</td>
                <td className="numeric">{volumeFormatter.format(venda.volumeLitros)}</td>
                <td className="numeric">{currencyFormatter.format(venda.valorTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
