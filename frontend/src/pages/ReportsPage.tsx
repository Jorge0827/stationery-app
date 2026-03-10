import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface TopProduct {
  productId: string
  productName: string
  totalQuantity: number
  totalAmount: number
}

export function ReportsPage() {
  const { token } = useAuth()
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const today = new Date()
  const defaultStart = new Date(today)
  defaultStart.setDate(today.getDate() - 30)

  const [startDate, setStartDate] = useState(defaultStart.toISOString().slice(0, 10))
  const [endDate, setEndDate]     = useState(today.toISOString().slice(0, 10))
  const [limit, setLimit]         = useState(10)

  const fetchReport = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const data = await apiFetch<TopProduct[]>(
        `/api/sales/top-products?start=${startDate}&end=${endDate}&limit=${limit}`,
        { token }
      )
      setTopProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar reporte')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [token])

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const maxQty = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.totalQuantity)) : 1

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reportes</h1>
          <div className="page-title-sub">Análisis de ventas y productos más vendidos</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="table-card p-4 mb-4">
        <h6 className="fw-bold mb-3" style={{ color: '#0f2044' }}>
          <i className="bi bi-funnel-fill me-2" style={{ color: '#4a90e2' }} />
          Filtros del reporte
        </h6>
        <div className="d-flex gap-3 align-items-end flex-wrap">
          <div>
            <label className="form-label">Desde</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Hasta</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Top N productos</label>
            <select
              className="form-select"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              style={{ width: 100 }}
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <button className="btn-navy" onClick={fetchReport} style={{ padding: '8px 20px' }}>
            <i className="bi bi-bar-chart-fill me-1" />
            Generar reporte
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-exclamation-circle-fill" />
          {error}
        </div>
      )}

      <div className="table-card">
        <div className="p-4 border-bottom" style={{ borderColor: '#e8edf5 !important' }}>
          <h6 className="fw-bold mb-0" style={{ color: '#0f2044' }}>
            <i className="bi bi-trophy-fill me-2" style={{ color: '#f4a261' }} />
            Top {limit} productos más vendidos
            <span className="ms-2" style={{ fontSize: '0.8rem', color: '#6c7a9e', fontWeight: 400 }}>
              {new Date(startDate + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
              {' — '}
              {new Date(endDate + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </h6>
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Generando reporte...</div>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bar-chart" />
            <div>No hay datos de ventas para el período seleccionado</div>
          </div>
        ) : (
          <div className="p-4">
            {topProducts.map((p, i) => (
              <div key={p.productId} className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      style={{
                        width: 28, height: 28,
                        borderRadius: '50%',
                        background: i === 0 ? '#f4a261' : i === 1 ? '#adb5bd' : i === 2 ? '#cd7f32' : '#e8edf5',
                        color: i < 3 ? 'white' : '#6c7a9e',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <span className="fw-semibold" style={{ color: '#0f2044', fontSize: '0.9rem' }}>
                        {p.productName}
                      </span>
                      <span className="ms-1" style={{ color: '#6c7a9e', fontSize: '0.75rem' }}>
                        ({p.productId})
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ color: '#0f2044', fontSize: '0.9rem' }}>
                      {fmt(p.totalAmount)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6c7a9e' }}>
                      {p.totalQuantity} unidades
                    </div>
                  </div>
                </div>
                {/* Barra de progreso */}
                <div style={{ height: 6, background: '#e8edf5', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(p.totalQuantity / maxQty) * 100}%`,
                      background: i === 0
                        ? 'linear-gradient(90deg, #f4a261, #e76f51)'
                        : 'linear-gradient(90deg, #4a90e2, #357abd)',
                      borderRadius: 3,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
