import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await apiFetch<{ jwt: string }>('/api/auth/login', {
        method: 'POST',
        body: { username: email, password },
      })
      await login(data.jwt)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciales inválidas')
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
                    <i className="bi bi-journal-bookmark-fill" />
                  </div>
                  <h4 className="auth-title mb-1">Papel y Magia</h4>
                  <p className="auth-subtitle mb-0">Sistema de gestión de papelería</p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-circle-fill" />
                    <span className="small">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ background: '#f0f4f8', border: '1.5px solid #d1dbe8', borderRight: 'none' }}>
                        <i className="bi bi-envelope" style={{ color: '#6c7a9e' }} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="tu@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        style={{ borderLeft: 'none' }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ background: '#f0f4f8', border: '1.5px solid #d1dbe8', borderRight: 'none' }}>
                        <i className="bi bi-lock" style={{ color: '#6c7a9e' }} />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        style={{ borderLeft: 'none' }}
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-lg w-100 mb-3"
                    type="submit"
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Ingresando...</>
                      : <><i className="bi bi-box-arrow-in-right me-2" />Ingresar</>
                    }
                  </button>
                </form>

                <p className="text-center mb-0" style={{ fontSize: '0.85rem', color: '#6c7a9e' }}>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 fw-semibold"
                    style={{ fontSize: '0.85rem', color: '#4a90e2' }}
                    onClick={() => navigate('/signup')}
                  >
                    Registrarme
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
