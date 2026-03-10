import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Supplier {
  id: number
  name: string
  prefix: string
  phoneNumber: string
  addres: string
  email: string
  nit: string
}

interface SupplierForm {
  name: string
  prefix: string
  phoneNumber: string
  addres: string
  email: string
  nit: string
}

const emptyForm: SupplierForm = {
  name: '', prefix: '', phoneNumber: '', addres: '', email: '', nit: '',
}

export function SuppliersPage() {
  const { token, isAdmin } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Supplier | null>(null)
  const [form, setForm]           = useState<SupplierForm>(emptyForm)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)
  const [deleting, setDeleting]         = useState(false)

  const [search, setSearch] = useState('')

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<Supplier[]>('/api/suppliers', { token })
      setSuppliers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar proveedores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSuppliers() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setEditTarget(null)
    setFormError(null)
    setShowModal(true)
  }

  const openEdit = (s: Supplier) => {
    setForm({
      name: s.name,
      prefix: s.prefix ?? '',
      phoneNumber: s.phoneNumber,
      addres: s.addres,
      email: s.email,
      nit: s.nit,
    })
    setEditTarget(s)
    setFormError(null)
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      if (editTarget) {
        await apiFetch(`/api/suppliers/${editTarget.id}`, { token, method: 'PUT', body: form })
      } else {
        await apiFetch('/api/suppliers', { token, method: 'POST', body: form })
      }
      setShowModal(false)
      fetchSuppliers()
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
      await apiFetch(`/api/suppliers/${deleteTarget.id}`, { token, method: 'DELETE' })
      setDeleteTarget(null)
      fetchSuppliers()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nit.includes(search) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Proveedores</h1>
          <div className="page-title-sub">Gestión de proveedores y contactos</div>
        </div>
        {isAdmin && (
          <button className="btn-navy" onClick={openCreate}>
            <i className="bi bi-plus-lg" />
            Nuevo proveedor
          </button>
        )}
      </div>

      <div className="mb-3" style={{ maxWidth: 360 }}>
        <div className="input-group">
          <span className="input-group-text" style={{ background: '#fff', border: '1.5px solid #d1dbe8', borderRight: 'none' }}>
            <i className="bi bi-search" style={{ color: '#6c7a9e' }} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, NIT o email..."
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
            <div>Cargando proveedores...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-truck" />
            <div>No se encontraron proveedores</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>NIT</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td><span style={{ color: '#6c7a9e', fontSize: '0.85rem' }}>{s.id}</span></td>
                  <td className="fw-semibold">{s.name}</td>
                  <td><code style={{ background: '#f0f4f8', padding: '2px 8px', borderRadius: 6, fontSize: '0.8rem' }}>{s.nit}</code></td>
                  <td>
                    {s.prefix ? <span className="text-muted me-1">+{s.prefix}</span> : null}
                    {s.phoneNumber}
                  </td>
                  <td style={{ color: '#4a90e2' }}>{s.email}</td>
                  <td style={{ color: '#6c7a9e', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.addres}
                  </td>
                  <td>
                    {isAdmin ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          style={{ borderRadius: 6 }}
                          onClick={() => openEdit(s)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: 6 }}
                          onClick={() => setDeleteTarget(s)}
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
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${editTarget ? 'bi-pencil-fill' : 'bi-plus-circle-fill'} me-2`} />
                  {editTarget ? 'Editar proveedor' : 'Nuevo proveedor'}
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
                    <div className="col-md-8">
                      <label className="form-label">Nombre / Razón Social *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        maxLength={50}
                        required
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">NIT *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.nit}
                        onChange={(e) => setForm({ ...form, nit: e.target.value })}
                        required
                        placeholder="900123456-7"
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Indicativo</label>
                      <div className="input-group">
                        <span className="input-group-text">+</span>
                        <input
                          type="text"
                          className="form-control"
                          value={form.prefix}
                          onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                          placeholder="57"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Teléfono *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        maxLength={10}
                        required
                        placeholder="3001234567"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="proveedor@empresa.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Dirección *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.addres}
                        onChange={(e) => setForm({ ...form, addres: e.target.value })}
                        required
                        placeholder="Dirección completa"
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
                      : <><i className="bi bi-check-lg me-1" />{editTarget ? 'Actualizar' : 'Crear proveedor'}</>
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
                  Eliminar proveedor
                </h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
                <p className="mt-3 mb-1">¿Eliminar el proveedor?</p>
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
