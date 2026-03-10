import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Product {
  id: string
  name: string
  description: string
  unitPrice: number
  currentStock: number
}

export function InventoryPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [threshold, setThreshold] = useState(10)

  useEffect(() => {
    if (!token) return
    apiFetch<Product[]>('/api/products/by-stock-asc', { token })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const lowCount = products.filter((p) => p.currentStock <= threshold).length

  const getStockColor = (stock: number) => {
    if (stock === 0)          return { bg: '#fff0f0', border: '#e63946', text: '#c1121f', label: 'Agotado' }
    if (stock <= threshold)   return { bg: '#fff5f0', border: '#f4a261', text: '#c96a1a', label: 'Bajo stock' }
    if (stock <= threshold * 2) return { bg: '#fffbf0', border: '#f4d261', text: '#b89d00', label: 'Precaución' }
    return { bg: '#f0fdf9', border: '#2ec4b6', text: '#1a8c7f', label: 'OK' }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <div className="page-title-sub">Estado de stock — ordenado de menor a mayor</div>
        </div>
        {lowCount > 0 && (
          <span
            className="badge d-flex align-items-center gap-1"
            style={{ background: 'rgba(230,57,70,0.1)', color: '#e63946', fontSize: '0.85rem', padding: '8px 14px', borderRadius: 20 }}
          >
            <i className="bi bi-exclamation-triangle-fill" />
            {lowCount} bajo stock
          </span>
        )}
      </div>

      {/* Umbral configurable */}
      <div className="table-card p-4 mb-4">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div>
            <label className="form-label mb-1">Umbral de alerta de stock</label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="range"
                min={1}
                max={50}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                style={{ width: 160 }}
              />
              <span
                className="fw-bold"
                style={{ color: '#0f2044', minWidth: 40 }}
              >
                ≤ {threshold}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {[
              { color: '#e63946', label: 'Agotado (0)' },
              { color: '#f4a261', label: `Bajo stock (≤ ${threshold})` },
              { color: '#f4d261', label: `Precaución (≤ ${threshold * 2})` },
              { color: '#2ec4b6', label: 'Suficiente' },
            ].map((l) => (
              <span key={l.label} className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: '#6c7a9e' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Cargando inventario...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-layers" />
            <div>No hay productos en el inventario</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Stock actual</th>
                <th style={{ textAlign: 'right' }}>Precio unit.</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const s = getStockColor(p.currentStock)
                return (
                  <tr key={p.id} style={{ background: s.bg }}>
                    <td>
                      <code style={{ background: '#f0f4f8', padding: '2px 8px', borderRadius: 6, fontSize: '0.8rem' }}>
                        {p.id}
                      </code>
                    </td>
                    <td>
                      <div className="fw-semibold" style={{ color: '#0f2044' }}>{p.name}</div>
                      {p.description && (
                        <div style={{ fontSize: '0.75rem', color: '#6c7a9e', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          background: `${s.border}20`,
                          color: s.text,
                          border: `1px solid ${s.border}40`,
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        <i className={`bi ${p.currentStock === 0 ? 'bi-x-circle-fill' : p.currentStock <= threshold ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-1`} />
                        {s.label}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span
                        className="fw-bold"
                        style={{ fontSize: '1.1rem', color: p.currentStock === 0 ? '#e63946' : p.currentStock <= threshold ? '#c96a1a' : '#0f2044' }}
                      >
                        {p.currentStock}
                      </span>
                      <span style={{ color: '#6c7a9e', fontSize: '0.75rem', marginLeft: 4 }}>uds</span>
                    </td>
                    <td style={{ textAlign: 'right', color: '#6c7a9e' }}>
                      {fmt(p.unitPrice)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}
