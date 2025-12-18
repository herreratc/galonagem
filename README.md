# Galonagem — Monitoramento de vendas de combustíveis

Aplicação composta por uma API Node/Express e um frontend Vite + React para consultar vendas de combustíveis por dia, filtrar resultados e exportar dados em CSV ou XLSX.

## Estrutura do projeto
- `/server`: API em Node/Express que expõe os endpoints de filiais, produtos, vendas e healthcheck. Inclui script SQL para criação da view que simplifica as consultas.
- `/web`: Aplicação React (Vite + TypeScript) que consome a API, exibe filtros, resumos e tabela de vendas com opções de exportação.

## Pré-requisitos
- Node.js 18+
- Acesso a um SQL Server com o banco **ATXDADOS**

## Configuração do banco
1. Conecte-se ao SQL Server.
2. Execute o script `server/sql/01_view_vendas.sql` para criar/atualizar a view `dbo.vw_Vendas_Combustiveis_Dia`.

## Variáveis de ambiente
### API (`/server`)
Crie um arquivo `.env` em `/server` a partir de `.env.example`:
```
SQLSERVER_HOST=localhost
SQLSERVER_DB=ATXDADOS
SQLSERVER_USER=your_user
SQLSERVER_PASSWORD=your_password
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true
PORT=3001
```
> Não committe credenciais reais.

### Frontend (`/web`)
Crie um arquivo `.env` em `/web` a partir de `.env.example` e configure a URL base da API:
```
VITE_API_BASE_URL=http://localhost:3001
```

## Instalação
Na raiz do repositório, instale as dependências dos workspaces:
```
npm install
```

## Execução
### API
```
npm run dev:server
```
A API sobe na porta definida em `PORT` (padrão 3001) com CORS habilitado.

### Frontend
```
npm run dev:web
```
A aplicação fica disponível em `http://localhost:5173` por padrão e consome a API via `VITE_API_BASE_URL`.

## Endpoints principais
- `GET /api/health`: status da API.
- `GET /api/filiais`: lista de filiais ativas.
- `GET /api/produtos?somenteCombustivel=1`: produtos ativos de combustíveis (`ID_LOCALVENDAS = 1`).
- `GET /api/vendas?dataIni=YYYY-MM-DD&dataFim=YYYY-MM-DD&idFilial=...&idProduto=...`: retorna vendas diárias filtradas e ordenadas por data ascendente.

## Funcionalidades do frontend
- Filtros por período, filial e produto.
- Resumo com volume total, valor total e ticket médio.
- Tabela detalhada de vendas.
- Exportação em CSV (no navegador) e XLSX (SheetJS) considerando os filtros aplicados.
