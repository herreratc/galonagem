interface SummaryCardsProps {
  totalVolume: number
  totalValue: number
  ticketMedio: number
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const volumeFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

export function SummaryCards({ totalVolume, totalValue, ticketMedio }: SummaryCardsProps) {
  const items = [
    { label: 'Volume total', value: `${volumeFormatter.format(totalVolume)} L` },
    { label: 'Valor total', value: currencyFormatter.format(totalValue) },
    { label: 'Ticket médio', value: ticketMedio ? currencyFormatter.format(ticketMedio) : 'R$ 0,00' },
  ]

  return (
    <section className="cards-grid" aria-label="Resumo de vendas">
      {items.map((item) => (
        <article className="card" key={item.label}>
          <p className="overline">{item.label}</p>
          <p className="metric">{item.value}</p>
        </article>
      ))}
    </section>
  )
}
