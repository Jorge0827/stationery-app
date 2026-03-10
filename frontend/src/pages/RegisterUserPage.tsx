import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Role {
  id: number
  rolName: string
}

export function RegisterUserPage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idRol, setIdRol] = useState<number | ''>('')
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      apiFetch<Role[]>('/api/roles', { token })
        .then(setRoles)
        .catch(() => {})
    }
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        token,
        body: { userName, email, password, idRol: Number(idRol) },
      })
      setSuccess('Usuario registrado correctamente')
      setUserName('')
      setEmail('')
      setPassword('')
      setIdRol('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center auth-bg py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="card shadow border-0 rounded-4 overflow-hidden">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-logo mb-3">📘</div>
                  <h4 className="fw-bold text-dark">Registrar usuario</h4>
                  <p className="text-muted small mb-0">Crea una cuenta para la papelería</p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {success && <div className="alert alert-success py-2 small">{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Nombre de usuario</label>
                    <input
                      type="text"
                      className="form-control"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-semibold">Rol</label>
                    <select
                      className="form-select"
                      value={idRol}
                      onChange={(e) => setIdRol(e.target.value ? Number(e.target.value) : '')}
                      required
                    >
                      <option value="">Selecciona un rol</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.rolName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary w-100 mb-2" type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Registrar usuario'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100"
                    onClick={() => navigate('/')}
                  >
                    Volver al dashboard
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
