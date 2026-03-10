import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

interface NavItem {
  path: string
  label: string
  icon: string
  section?: string
}

const navItems: NavItem[] = [
  { path: '/',           label: 'Dashboard',   icon: 'bi-grid-1x2-fill',   section: 'Principal' },
  { path: '/products',   label: 'Productos',   icon: 'bi-box-seam-fill',   section: 'Catálogo' },
  { path: '/suppliers',  label: 'Proveedores', icon: 'bi-truck',            section: 'Catálogo' },
  { path: '/inventory',  label: 'Inventario',  icon: 'bi-layers-fill',     section: 'Operaciones' },
  { path: '/purchases',  label: 'Compras',     icon: 'bi-cart-check-fill', section: 'Operaciones' },
  { path: '/sales',      label: 'Ventas',      icon: 'bi-bag-check-fill',  section: 'Operaciones' },
  { path: '/reports',    label: 'Reportes',    icon: 'bi-bar-chart-fill',  section: 'Análisis' },
  { path: '/users',      label: 'Usuarios',    icon: 'bi-people-fill',     section: 'Administración' },
]

export function AppLayout() {
  const { logout, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const sections = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const section = item.section ?? 'General'
    if (!acc[section]) acc[section] = []
    acc[section].push(item)
    return acc
  }, {})

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <i className="bi bi-journal-bookmark-fill" style={{ color: 'white' }} />
          </div>
          <div>
            <div className="sidebar-brand-name">Papel y Magia</div>
            <div className="sidebar-brand-sub">Sistema de Papelería</div>
          </div>
        </div>

        {user && (
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4a90e2,#2ec4b6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</div>
                <div style={{ fontSize: '0.65rem', color: isAdmin ? '#4a90e2' : '#2ec4b6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <i className={`bi ${isAdmin ? 'bi-shield-fill' : 'bi-person-badge-fill'} me-1`} />
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          {Object.entries(sections).map(([section, items]) => (
            <div key={section}>
              <div className="sidebar-section-label">{section}</div>
              {items.map(({ path, label, icon }) => (
                <button
                  key={path}
                  type="button"
                  className={`sidebar-item ${isActive(path) ? 'active' : ''}`}
                  onClick={() => navigate(path)}
                >
                  <i className={`bi ${icon}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-item w-100"
            style={{ color: 'rgba(230,57,70,0.8)' }}
            onClick={logout}
          >
            <i className="bi bi-box-arrow-left" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div className="main-content">
        <header className="app-header">
          <div>
            <div className="header-title">Papelería Papel y Magia</div>
            <div className="header-date">{today}</div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge" style={{ background: 'rgba(74,144,226,0.12)', color: '#4a90e2', fontWeight: 600, fontSize: '0.75rem', padding: '6px 12px', borderRadius: '20px' }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }} />
              En línea
            </span>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
