import { utils, writeFile } from 'xlsx'
import { Filters, Venda } from '../types'

interface ExportButtonsProps {
  vendas: Venda[]
  filters: Filters
  filialLabel: string
  produtoLabel: string
}

function buildFilename(suffix: string) {
  const date = new Date().toISOString().slice(0, 10)
  return `vendas-${date}.${suffix}`
}

function exportCsv(vendas: Venda[], filters: Filters, filialLabel: string, produtoLabel: string) {
  if (!vendas.length) return

  const headers = ['Data', 'Filial', 'Produto', 'Volume (L)', 'Valor (R$)']
  const rows = vendas.map((venda) => [
    venda.data,
    venda.nomeFilial,
    venda.nomeProduto,
    venda.volumeLitros.toString().replace('.', ','),
    venda.valorTotal.toFixed(2).replace('.', ','),
  ])

  const metadata = [
    ['Período', `${filters.dataIni || '-'} a ${filters.dataFim || '-'}`],
    ['Filial', filialLabel],
    ['Produto', produtoLabel],
    [],
  ]

  const content = [...metadata, headers, ...rows]
    .map((line) => line.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = buildFilename('csv')
  link.click()
  URL.revokeObjectURL(url)
}

function exportXlsx(
  vendas: Venda[],
  filters: Filters,
  filialLabel: string,
  produtoLabel: string,
) {
  if (!vendas.length) return

  const worksheetData = [
    ['Data', 'Filial', 'Produto', 'Volume (L)', 'Valor (R$)'],
    ...vendas.map((venda) => [
      venda.data,
      venda.nomeFilial,
      venda.nomeProduto,
      venda.volumeLitros,
      venda.valorTotal,
    ]),
  ]

  const sheet = utils.aoa_to_sheet(worksheetData)

  const headerSheet = utils.aoa_to_sheet([
    ['Período', `${filters.dataIni || '-'} a ${filters.dataFim || '-'}`],
    ['Filial', filialLabel],
    ['Produto', produtoLabel],
  ])

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, headerSheet, 'Filtros')
  utils.book_append_sheet(workbook, sheet, 'Vendas')

  writeFile(workbook, buildFilename('xlsx'))
}

export function ExportButtons({ vendas, filters, filialLabel, produtoLabel }: ExportButtonsProps) {
  return (
    <div className="export-buttons">
      <button
        type="button"
        onClick={() => exportCsv(vendas, filters, filialLabel, produtoLabel)}
        disabled={!vendas.length}
      >
        Exportar CSV
      </button>
      <button
        type="button"
        onClick={() => exportXlsx(vendas, filters, filialLabel, produtoLabel)}
        disabled={!vendas.length}
      >
        Exportar XLSX
      </button>
    </div>
  )
}
