import './App.css'
import { SalesPage } from './pages/SalesPage'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="overline">Dashboard</p>
          <h1>Vendas de Combustíveis</h1>
          <p className="subtitle">
            Consulte volumes e valores por dia, filtrando por período, filial e produto.
          </p>
        </div>
      </header>

      <SalesPage />
    </div>
  )
}

export default App
