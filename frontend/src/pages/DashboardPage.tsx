import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Product { id: string; currentStock: number }
interface Sale    { total: number; salesDate: string }

export function DashboardPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [totalProducts, setTotalProducts] = useState<number | null>(null)
  const [lowStockCount, setLowStockCount] = useState<number | null>(null)
  const [salesToday, setSalesToday]       = useState<number | null>(null)
  const [incomeToday, setIncomeToday]     = useState<number | null>(null)

  useEffect(() => {
    if (!token) return
    const today = new Date().toISOString().slice(0, 10)
    Promise.all([
      apiFetch<Product[]>('/api/products', { token })
        .then((p) => setTotalProducts(p.length)),
      apiFetch<Product[]>('/api/products/low-stock?threshold=10', { token })
        .then((p) => setLowStockCount(p.length)),
      apiFetch<Sale[]>(`/api/sales/by-date?start=${today}&end=${today}`, { token })
        .then((s) => {
          setSalesToday(s.length)
          setIncomeToday(s.reduce((sum, x) => sum + Number(x.total), 0))
        }),
    ]).catch(() => {})
  }, [token])

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const kpis = [
    {
      label: 'Total Productos',
      value: totalProducts === null ? '...' : totalProducts,
      icon: 'bi-box-seam-fill',
      iconClass: 'blue',
      path: '/products',
    },
    {
      label: 'Bajo Stock',
      value: lowStockCount === null ? '...' : lowStockCount,
      icon: 'bi-exclamation-triangle-fill',
      iconClass: 'red',
      path: '/inventory',
    },
    {
      label: 'Ventas Hoy',
      value: salesToday === null ? '...' : salesToday,
      icon: 'bi-bag-check-fill',
      iconClass: 'teal',
      path: '/sales',
    },
    {
      label: 'Ingresos Hoy',
      value: incomeToday === null ? '...' : fmt(incomeToday),
      icon: 'bi-cash-stack',
      iconClass: 'gold',
      path: '/reports',
    },
  ]

  const quickActions = [
    { label: 'Gestionar productos',  icon: 'bi-box-seam',        path: '/products',  variant: 'btn-navy' },
    { label: 'Registrar venta',      icon: 'bi-bag-plus-fill',   path: '/sales',     variant: 'btn-navy' },
    { label: 'Registrar compra',     icon: 'bi-cart-plus-fill',  path: '/purchases', variant: 'btn-outline-secondary' },
    { label: 'Proveedores',          icon: 'bi-truck',           path: '/suppliers', variant: 'btn-outline-secondary' },
    { label: 'Usuarios',             icon: 'bi-people-fill',     path: '/users',     variant: 'btn-outline-secondary' },
  ]

  return (
    <>
      <div className="mb-4">
        <h1 className="page-title">
          Bienvenido{user ? `, ${user.name}` : ''}
        </h1>
        <div className="page-title-sub">Panel de control — resumen del día de hoy</div>
      </div>

      {/* KPIs */}
      <div className="row g-3 mb-4">
        {kpis.map((k) => (
          <div key={k.path} className="col-6 col-xl-3">
            <div
              className="kpi-card"
              onClick={() => navigate(k.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`kpi-icon ${k.iconClass}`}>
                <i className={`bi ${k.icon}`} />
              </div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Accesos rápidos */}
        <div className="col-12 col-lg-8">
          <div className="table-card p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#0f2044' }}>
              <i className="bi bi-lightning-fill me-2 text-warning" />
              Accesos rápidos
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {quickActions.map((a) => (
                <button
                  key={a.path}
                  type="button"
                  className={`btn ${a.variant} d-flex align-items-center gap-2`}
                  style={{ borderRadius: 8, fontSize: '0.875rem', padding: '8px 16px' }}
                  onClick={() => navigate(a.path)}
                >
                  <i className={`bi ${a.icon}`} />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="col-12 col-lg-4">
          <div className="table-card p-4" style={{ height: '100%' }}>
            <h6 className="fw-bold mb-3" style={{ color: '#0f2044' }}>
              <i className="bi bi-bell-fill me-2" style={{ color: '#f4a261' }} />
              Alertas
            </h6>
            <div
              className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2"
              style={{ background: lowStockCount && lowStockCount > 0 ? 'rgba(230,57,70,0.07)' : 'rgba(46,196,182,0.07)', cursor: 'pointer' }}
              onClick={() => navigate('/inventory')}
            >
              <div>
                <div className="fw-semibold" style={{ fontSize: '0.875rem', color: '#0f2044' }}>
                  {lowStockCount === null ? '...' : lowStockCount} productos bajo stock
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c7a9e' }}>Umbral ≤ 10 unidades</div>
              </div>
              <i
                className={`bi ${lowStockCount && lowStockCount > 0 ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'}`}
                style={{
                  fontSize: '1.25rem',
                  color: lowStockCount && lowStockCount > 0 ? '#e63946' : '#2ec4b6',
                }}
              />
            </div>
            <div
              className="d-flex align-items-center justify-content-between p-3 rounded-3"
              style={{ background: 'rgba(74,144,226,0.07)', cursor: 'pointer' }}
              onClick={() => navigate('/sales')}
            >
              <div>
                <div className="fw-semibold" style={{ fontSize: '0.875rem', color: '#0f2044' }}>
                  {salesToday === null ? '...' : salesToday} ventas registradas hoy
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c7a9e' }}>Ver detalle de ventas</div>
              </div>
              <i className="bi bi-bag-check-fill" style={{ fontSize: '1.25rem', color: '#4a90e2' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
