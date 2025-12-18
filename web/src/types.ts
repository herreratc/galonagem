export interface Filial {
  id: number
  nome: string
}

export interface Produto {
  id: number
  nome: string
}

export interface Venda {
  data: string
  idFilial: number
  nomeFilial: string
  idProduto: number
  nomeProduto: string
  volumeLitros: number
  valorTotal: number
}

export interface Filters {
  dataIni: string
  dataFim: string
  idFilial: string
  idProduto: string
}
