import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../api/api'

interface Role {
  id: number
  rolName: string
}

export function SignupPage() {
  const navigate = useNavigate()
  const [roles, setRoles]       = useState<Role[]>([])
  const [userName, setUserName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [idRol, setIdRol]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    apiFetch<Role[]>('/api/roles').then(setRoles).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: { userName, email, password, idRol: parseInt(idRol, 10) },
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center auth-bg">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="auth-card card">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="auth-logo mb-3">
                    <i className="bi bi-person-plus-fill" />
                  </div>
                  <h4 className="auth-title mb-1">Crear cuenta</h4>
                  <p className="auth-subtitle mb-0">Regístrate en Papel y Magia</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-circle-fill" />
                    <span className="small">{error}</span>
                  </div>
                )}

                {success ? (
                  <div className="alert alert-success d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill" />
                    <span className="small">¡Cuenta creada! Redirigiendo al login...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre de usuario *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Tu nombre"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        maxLength={25}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo electrónico *</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        maxLength={25}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        value={idRol}
                        onChange={(e) => setIdRol(e.target.value)}
                        required
                      >
                        <option value="">— Selecciona tu rol —</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.rolName}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="btn btn-primary btn-lg w-100 mb-3"
                      type="submit"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2" />Registrando...</>
                        : <><i className="bi bi-person-check-fill me-2" />Crear cuenta</>
                      }
                    </button>
                  </form>
                )}

                <p className="text-center mb-0" style={{ fontSize: '0.85rem', color: '#6c7a9e' }}>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    style={{ fontSize: '0.85rem', color: '#4a90e2' }}
                    onClick={() => navigate('/login')}
                  >
                    Ingresar
                  </button>
                </p>
              </div>
            </div>

            <p className="text-center mt-3 text-white-50" style={{ fontSize: '0.75rem' }}>
              © 2025 Papelería Papel y Magia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
