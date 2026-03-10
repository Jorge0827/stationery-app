import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Role {
  id: number
  rolName: string
}

interface UserForm {
  userName: string
  email: string
  password: string
  idRol: string
}

const emptyForm: UserForm = { userName: '', email: '', password: '', idRol: '' }

export function UsersPage() {
  const { token, isAdmin } = useAuth()
  const [users, setUsers]   = useState<User[]>([])
  const [roles, setRoles]   = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  const [showModal, setShowModal]   = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [form, setForm]             = useState<UserForm>(emptyForm)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleting, setDeleting]         = useState(false)

  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<User[]>('/api/users', { token })
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const data = await apiFetch<Role[]>('/api/roles')
      setRoles(data)
    } catch { /* no critical */ }
  }

  useEffect(() => { fetchUsers(); fetchRoles() }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setEditTarget(null)
    setFormError(null)
    setFormSuccess(false)
    setShowModal(true)
  }

  const openEdit = (u: User) => {
    const matchRole = roles.find(
      (r) => r.rolName.toLowerCase() === u.role.toLowerCase()
    )
    setForm({
      userName: u.name,
      email: u.email,
      password: '',
      idRol: matchRole ? String(matchRole.id) : '',
    })
    setEditTarget(u)
    setFormError(null)
    setFormSuccess(false)
    setShowModal(true)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        userName: form.userName,
        email: form.email,
        idRol: parseInt(form.idRol, 10),
      }
      if (form.password) body.password = form.password

      if (editTarget) {
        if (!form.password) {
          setFormError('Debes ingresar la contraseña para actualizar el usuario.')
          setSaving(false)
          return
        }
        await apiFetch(`/api/${editTarget.id}`, { token, method: 'PUT', body })
      } else {
        if (!form.password) {
          setFormError('La contraseña es requerida.')
          setSaving(false)
          return
        }
        await apiFetch('/api/auth/register', { token, method: 'POST', body })
      }
      setFormSuccess(true)
      setTimeout(() => { setShowModal(false); setFormSuccess(false); fetchUsers() }, 1200)
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
      await apiFetch(`/api/${deleteTarget.id}`, { token, method: 'DELETE' })
      setDeleteTarget(null)
      fetchUsers()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  )

  const roleBadge = (role: string) => {
    const isAdmin = role.toLowerCase().includes('admin')
    return (
      <span
        className="badge"
        style={{
          background: isAdmin ? 'rgba(74,144,226,0.12)' : 'rgba(46,196,182,0.12)',
          color: isAdmin ? '#1a6fc4' : '#1a8c7f',
          fontWeight: 600,
          fontSize: '0.75rem',
          padding: '4px 10px',
          borderRadius: 20,
        }}
      >
        <i className={`bi ${isAdmin ? 'bi-shield-fill' : 'bi-person-badge-fill'} me-1`} />
        {role}
      </span>
    )
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuarios</h1>
          <div className="page-title-sub">Gestión de usuarios del sistema</div>
        </div>
        {isAdmin && (
          <button className="btn-navy" onClick={openCreate}>
            <i className="bi bi-person-plus-fill" />
            Nuevo usuario
          </button>
        )}
      </div>

      <div className="mb-3" style={{ maxWidth: 340 }}>
        <div className="input-group">
          <span className="input-group-text" style={{ background: '#fff', border: '1.5px solid #d1dbe8', borderRight: 'none' }}>
            <i className="bi bi-search" style={{ color: '#6c7a9e' }} />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, email o rol..."
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
            <div>Cargando usuarios...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-people" />
            <div>No se encontraron usuarios</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><span style={{ color: '#6c7a9e', fontSize: '0.85rem' }}>{u.id}</span></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #4a90e2, #1a3260)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#4a90e2' }}>{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>
                    {isAdmin ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-secondary me-1"
                          style={{ borderRadius: 6 }}
                          onClick={() => openEdit(u)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil-fill" />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          style={{ borderRadius: 6 }}
                          onClick={() => setDeleteTarget(u)}
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
                  <i className={`bi ${editTarget ? 'bi-pencil-fill' : 'bi-person-plus-fill'} me-2`} />
                  {editTarget ? 'Editar usuario' : 'Nuevo usuario'}
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
                  {formSuccess && (
                    <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill" />
                      {editTarget ? 'Usuario actualizado.' : 'Usuario creado exitosamente.'}
                    </div>
                  )}
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nombre de usuario *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.userName}
                        onChange={(e) => setForm({ ...form, userName: e.target.value })}
                        maxLength={25}
                        required
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="usuario@correo.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">
                        {editTarget ? 'Nueva contraseña (requerida para guardar)' : 'Contraseña *'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        minLength={8}
                        maxLength={25}
                        required={!editTarget}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        value={form.idRol}
                        onChange={(e) => setForm({ ...form, idRol: e.target.value })}
                        required
                      >
                        <option value="">— Selecciona un rol —</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.rolName}</option>
                        ))}
                      </select>
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
                      : <><i className="bi bi-check-lg me-1" />{editTarget ? 'Actualizar' : 'Crear usuario'}</>
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
                  Eliminar usuario
                </h5>
                <button type="button" className="btn-close" onClick={() => setDeleteTarget(null)} />
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: '2.5rem' }} />
                <p className="mt-3 mb-1">¿Eliminar al usuario?</p>
                <p className="fw-bold mb-0">{deleteTarget.name}</p>
                <small className="text-muted">{deleteTarget.email}</small>
                <div className="mt-2"><small className="text-muted">Esta acción no se puede deshacer.</small></div>
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
