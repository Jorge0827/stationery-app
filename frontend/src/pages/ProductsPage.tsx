import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Product {
  id: string
  name: string
  description: string
  unitPrice: number
  currentStock: number
}

interface ProductForm {
  id: string
  name: string
  description: string
  unitPrice: string
  currentStock: string
}

const emptyForm: ProductForm = {
  id: '', name: '', description: '', unitPrice: '', currentStock: '',
}

export function ProductsPage() {
  const { token, isAdmin } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal]   = useState(false)
  const [editMode, setEditMode]     = useState(false)
  const [form, setForm]             = useState<ProductForm>(emptyForm)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting]         = useState(false)

  // Search
  const [search, setSearch] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<Product[]>('/api/products', { token })
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setEditMode(false)
    setFormError(null)
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      unitPrice: String(p.unitPrice),
      currentStock: String(p.currentStock),
    })
    setEditMode(true)
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      const body = {
        id: form.id,
        name: form.name,
        description: form.description,
        unitPrice: parseFloat(form.unitPrice),
        currentStock: parseInt(form.currentStock, 10),
      }
      if (editMode) {
        await apiFetch(`/api/products/${form.id}`, { token, method: 'PUT', body })
      } else {
        await apiFetch('/api/products', { token, method: 'POST', body })
      }
      setShowModal(false)
      fetchProducts()
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiFetch(`/api/products/${deleteTarget.id}`, { token, method: 'DELETE' })
      setDeleteTarget(null)
      fetchProducts()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <div className="page-title-sub">Gestión del catálogo de productos</div>
        </div>
        {isAdmin && (
          <button className="btn-navy" onClick={openCreate}>
            <i className="bi bi-plus-lg" />
            Nuevo producto
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="mb-3" style={{ maxWidth: 340 }}>
        <div className="input-group">
          <span className="input-group-text" style={{ background: '#fff', border: '1.5px solid #d1dbe8', borderRight: 'none' }}>
            <i className="bi bi-search" style={{ color: '#6c7a9e' }} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderLeft: 'none' }}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-exclamation-circle-fill" />
          {error}
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Cargando productos...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-box-seam" />
            <div>No se encontraron productos</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Stock</th>
                <th>Precio Unit.</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><code style={{ background: '#f0f4f8', padding: '2px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{p.id}</code></td>
                  <td className="fw-semibold">{p.name}</td>
                  <td style={{ color: '#6c7a9e', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.description || '—'}
                  </td>
                  <td>
                    <span className={`stock-badge ${p.currentStock <= 10 ? 'low' : 'ok'}`}>
                      {p.currentStock} uds
                    </span>
                  </td>
                  <td className="fw-semibold">{fmt(p.unitPrice)}</td>
                  <td>
                    {isAdmin ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          style={{ borderRadius: 6 }}
                          onClick={() => openEdit(p)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: 6 }}
                          onClick={() => setDeleteTarget(p)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash-fill" />
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#a0aec0', fontSize: '0.75rem' }}>Solo lectura</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Crear / Editar */}
      {showModal && (
        <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${editMode ? 'bi-pencil-fill' : 'bi-plus-circle-fill'} me-2`} />
                  {editMode ? 'Editar producto' : 'Nuevo producto'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-circle-fill" />
                      {formError}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Código ID *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                        maxLength={10}
                        required
                        disabled={editMode}
                        placeholder="Ej: P001"
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        maxLength={50}
                        required
                        placeholder="Nombre del producto"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        maxLength={300}
                        placeholder="Descripción opcional..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Precio unitario *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          value={form.unitPrice}
                          onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                          min="0.01"
                          step="0.01"
                          required
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stock actual *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={form.currentStock}
                        onChange={(e) => setForm({ ...form, currentStock: e.target.value })}
                        min="0"
                        required
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-navy" disabled={saving}>
                    {saving
                      ? <><span className="spinner-border spinner-border-sm me-1" />Guardando...</>
                      : <><i className="bi bi-check-lg me-1" />{editMode ? 'Actualizar' : 'Crear producto'}</>
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteTarget && (
        <div className="modal d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'linear-gradient(135deg,#b02a37,#842029)' }}>
                <h5 className="modal-title">
                  <i className="bi bi-trash-fill me-2" />
                  Eliminar producto
                </h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
                <p className="mt-3 mb-1">¿Eliminar el producto?</p>
                <p className="fw-bold mb-0">{deleteTarget.name}</p>
                <small className="text-muted">Esta acción no se puede deshacer.</small>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <span className="spinner-border spinner-border-sm" /> : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
