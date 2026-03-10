import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Purchase {
  id: number
  date: string
  total: number
  supplier: string
  user: string
}

interface Supplier {
  id: number
  name: string
  nit: string
}

interface Product {
  id: string
  name: string
  unitPrice: number
  currentStock: number
}

interface LineItem {
  product: Product
  quantity: number
  unitPrice: number
}

interface PurchaseDetail {
  idPurchase: number
  product: string
  quantity: number
  unitPrice: number
}

export function PurchasesPage() {
  const { token, user } = useAuth()
  const [purchases, setPurchases]   = useState<Purchase[]>([])
  const [suppliers, setSuppliers]   = useState<Supplier[]>([])
  const [products, setProducts]     = useState<Product[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [showForm, setShowForm]             = useState(false)
  const [supplierId, setSupplierId]         = useState('')
  const [lines, setLines]                   = useState<LineItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity]             = useState(1)
  const [linePrice, setLinePrice]           = useState('')
  const [saving, setSaving]                 = useState(false)
  const [formError, setFormError]           = useState<string | null>(null)
  const [formSuccess, setFormSuccess]       = useState(false)

  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd]     = useState('')

  const [expandedPurchase, setExpandedPurchase]           = useState<number | null>(null)
  const [purchaseDetails, setPurchaseDetails]             = useState<Record<number, PurchaseDetail[]>>({})
  const [loadingDetails, setLoadingDetails]               = useState<Record<number, boolean>>({})

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      let url = '/api/purchases'
      if (filterStart && filterEnd) url = `/api/purchases/by-date?start=${filterStart}&end=${filterEnd}`
      const data = await apiFetch<Purchase[]>(url, { token })
      setPurchases(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar compras')
    } finally {
      setLoading(false)
    }
  }

  const fetchCatalogs = async () => {
    try {
      const [sups, prods] = await Promise.all([
        apiFetch<Supplier[]>('/api/suppliers', { token }),
        apiFetch<Product[]>('/api/products', { token }),
      ])
      setSuppliers(sups)
      setProducts(prods)
      if (sups.length === 0) {
        setCatalogError('No hay proveedores registrados. Ve a Proveedores y crea uno antes de registrar compras.')
      }
    } catch (e) {
      setCatalogError('No se pudieron cargar los proveedores o productos: ' + (e instanceof Error ? e.message : ''))
    }
  }

  useEffect(() => { fetchPurchases(); fetchCatalogs() }, [])

  const toggleDetails = async (purchaseId: number) => {
    if (expandedPurchase === purchaseId) { setExpandedPurchase(null); return }
    setExpandedPurchase(purchaseId)
    if (purchaseDetails[purchaseId]) return

    setLoadingDetails((prev) => ({ ...prev, [purchaseId]: true }))
    try {
      const data = await apiFetch<PurchaseDetail[]>(`/api/purchasesDetails/byPurchase/${purchaseId}`, { token })
      setPurchaseDetails((prev) => ({ ...prev, [purchaseId]: data }))
    } catch { /* silent */ } finally {
      setLoadingDetails((prev) => ({ ...prev, [purchaseId]: false }))
    }
  }

  const handleFilter = () => fetchPurchases()
  const clearFilter  = () => { setFilterStart(''); setFilterEnd(''); setTimeout(fetchPurchases, 0) }

  const selectedProd = products.find((p) => p.id === selectedProduct)

  const addLine = () => {
    const prod = selectedProd
    if (!prod || !linePrice) return
    const price = parseFloat(linePrice)
    if (isNaN(price) || price <= 0) { setFormError('El precio de compra debe ser mayor a 0.'); return }
    setFormError(null)

    const existingIdx = lines.findIndex((l) => l.product.id === prod.id)
    if (existingIdx >= 0) {
      const updated = [...lines]
      updated[existingIdx].quantity += quantity
      setLines(updated)
    } else {
      setLines([...lines, { product: prod, quantity, unitPrice: price }])
    }
    setSelectedProduct('')
    setQuantity(1)
    setLinePrice('')
  }

  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx))

  const updateLineQty = (idx: number, qty: number) => {
    const updated = [...lines]
    updated[idx].quantity = Math.max(1, qty)
    setLines(updated)
  }

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)

  const handleCreatePurchase = async () => {
    if (!user)              { setFormError('No se pudo identificar el usuario. Vuelve a iniciar sesión.'); return }
    if (!supplierId)        { setFormError('Debes seleccionar un proveedor.'); return }
    if (lines.length === 0) { setFormError('Agrega al menos un producto.'); return }
    setFormError(null)
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const created = await apiFetch<Purchase>('/api/purchases', {
        token, method: 'POST',
        body: { date: today, total, supplier: parseInt(supplierId, 10), user: user.id },
      })

      await Promise.all(
        lines.map((l) =>
          apiFetch('/api/purchasesDetails', {
            token, method: 'POST',
            body: { idpurchase: created.id, idproduct: l.product.id, quantity: l.quantity, unitPrice: l.unitPrice },
          })
        )
      )
      setFormSuccess(true)
      setLines([])
      setSupplierId('')
      setTimeout(() => { setFormSuccess(false); setShowForm(false); fetchPurchases(); fetchCatalogs() }, 1800)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al registrar la compra')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  const onProductSelect = (pid: string) => {
    setSelectedProduct(pid)
    const p = products.find((x) => x.id === pid)
    if (p) setLinePrice(String(p.unitPrice))
    else setLinePrice('')
    setFormError(null)
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Compras</h1>
          <div className="page-title-sub">Registro de compras a proveedores</div>
        </div>
        <button
          className="btn-navy"
          onClick={() => { setShowForm(!showForm); setFormError(null); setFormSuccess(false); setLines([]) }}
          disabled={showForm ? false : suppliers.length === 0}
          title={suppliers.length === 0 ? 'Primero crea al menos un proveedor' : ''}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'}`} />
          {showForm ? 'Cancelar' : 'Registrar compra'}
        </button>
      </div>

      {/* Alerta si no hay proveedores o productos */}
      {catalogError && (
        <div className="alert d-flex align-items-center gap-2 mb-3" style={{ background: 'rgba(244,162,97,0.12)', border: '1px solid #f4a261', color: '#c96a1a', borderRadius: 10 }}>
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.1rem' }} />
          <span>{catalogError}</span>
        </div>
      )}

      {/* ── Formulario nueva compra ── */}
      {showForm && (
        <div className="table-card mb-4 p-4">
          <h5 className="fw-bold mb-3" style={{ color: '#0f2044' }}>
            <i className="bi bi-cart-check-fill me-2" style={{ color: '#4a90e2' }} />
            Nueva Compra
          </h5>

          {formError && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill" />{formError}
            </div>
          )}
          {formSuccess && (
            <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill" />¡Compra registrada exitosamente!
            </div>
          )}

          {/* Proveedor */}
          <div className="mb-3" style={{ maxWidth: 420 }}>
            <label className="form-label">Proveedor *</label>
            {suppliers.length === 0 ? (
              <div className="alert py-2 small" style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid #e63946', color: '#c1121f', borderRadius: 8 }}>
                <i className="bi bi-exclamation-circle-fill me-1" />
                No hay proveedores. Ve a <strong>Proveedores</strong> y crea uno primero.
              </div>
            ) : (
              <select
                className={`form-select ${!supplierId && formError ? 'is-invalid' : ''}`}
                value={supplierId}
                onChange={(e) => { setSupplierId(e.target.value); setFormError(null) }}
              >
                <option value="">— Selecciona un proveedor —</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.nit ? `— NIT: ${s.nit}` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selector de producto */}
          <div className="row g-2 align-items-end mb-2">
            <div className="col-md-4">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => onProductSelect(e.target.value)}
              >
                <option value="">— Selecciona un producto —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock actual: {p.currentStock})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                disabled={!selectedProduct}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Precio de compra *</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  min={0.01}
                  step={0.01}
                  value={linePrice}
                  onChange={(e) => setLinePrice(e.target.value)}
                  placeholder="0.00"
                  disabled={!selectedProduct}
                />
              </div>
              {selectedProd && linePrice && parseFloat(linePrice) < selectedProd.unitPrice && (
                <div className="small mt-1" style={{ color: '#f4a261' }}>
                  <i className="bi bi-info-circle me-1" />
                  Precio menor al de venta ({fmt(selectedProd.unitPrice)})
                </div>
              )}
            </div>
            <div className="col-md-2">
              <button
                className="btn-navy w-100"
                onClick={addLine}
                disabled={!selectedProduct || !linePrice}
                style={{ padding: '8px 12px' }}
              >
                <i className="bi bi-plus-lg" /> Agregar
              </button>
            </div>
          </div>

          {/* Líneas de compra */}
          {lines.length === 0 ? (
            <div
              className="text-center py-3 text-muted mt-2"
              style={{ background: '#f7f9fc', borderRadius: 8, border: '1.5px dashed #d1dbe8' }}
            >
              <i className="bi bi-cart" style={{ fontSize: '1.5rem', opacity: 0.4 }} />
              <div className="mt-1 small">No hay productos en esta compra aún</div>
            </div>
          ) : (
            <div className="mb-3 mt-2">
              <div
                className="d-flex align-items-center gap-2 mb-1 px-2"
                style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6c7a9e', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                <div className="flex-grow-1">Producto</div>
                <div style={{ width: 80 }}>Cantidad</div>
                <div style={{ width: 120, textAlign: 'right' }}>Precio c/u</div>
                <div style={{ width: 110, textAlign: 'right' }}>Subtotal</div>
                <div style={{ width: 32 }} />
              </div>

              {lines.map((l, idx) => (
                <div key={idx} className="line-item-row">
                  <div className="flex-grow-1">
                    <div className="product-name">{l.product.name}</div>
                    <div className="product-price" style={{ color: '#6c7a9e' }}>
                      Stock actual: <strong>{l.product.currentStock}</strong> uds
                    </div>
                  </div>
                  <div style={{ width: 80 }}>
                    <input
                      type="number"
                      className="form-control form-control-sm text-center"
                      min={1}
                      value={l.quantity}
                      onChange={(e) => updateLineQty(idx, parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                  <div style={{ width: 120, textAlign: 'right', color: '#0f2044', fontWeight: 600 }}>
                    {fmt(l.unitPrice)}
                  </div>
                  <div className="fw-bold" style={{ width: 110, textAlign: 'right', color: '#0f2044' }}>
                    {fmt(l.unitPrice * l.quantity)}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: 6, width: 32, padding: 0 }}
                    onClick={() => removeLine(idx)}
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}

              <div className="d-flex justify-content-end mt-2">
                <div className="px-3 py-2 rounded-3" style={{ background: '#0f2044', color: 'white' }}>
                  <span className="me-2">Total:</span>
                  <strong style={{ fontSize: '1.1rem' }}>{fmt(total)}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex gap-2 justify-content-end mt-3">
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setLines([]) }}>
              Cancelar
            </button>
            <button
              className="btn-navy"
              onClick={handleCreatePurchase}
              disabled={saving || lines.length === 0 || !supplierId}
            >
              {saving
                ? <><span className="spinner-border spinner-border-sm me-1" />Registrando...</>
                : <><i className="bi bi-check-lg me-1" />Confirmar compra</>
              }
            </button>
          </div>
        </div>
      )}

      {/* ── Filtros de fecha ── */}
      <div className="d-flex gap-2 align-items-end mb-3 flex-wrap">
        <div>
          <label className="form-label mb-1">Desde</label>
          <input type="date" className="form-control" value={filterStart} onChange={(e) => setFilterStart(e.target.value)} />
        </div>
        <div>
          <label className="form-label mb-1">Hasta</label>
          <input type="date" className="form-control" value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)} />
        </div>
        <button className="btn-navy" onClick={handleFilter} style={{ padding: '8px 16px' }}>
          <i className="bi bi-funnel-fill" /> Filtrar
        </button>
        {(filterStart || filterEnd) && (
          <button className="btn btn-outline-secondary" onClick={clearFilter} style={{ borderRadius: 8, padding: '8px 16px' }}>
            <i className="bi bi-x-lg" /> Limpiar
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
          <i className="bi bi-exclamation-circle-fill" />{error}
        </div>
      )}

      {/* ── Tabla historial ── */}
      <div className="table-card">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary mb-2" />
            <div>Cargando compras...</div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-cart-check" />
            <div>No hay compras registradas</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>#</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Registrado por</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <>
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => toggleDetails(p.id)}>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <i
                        className={`bi ${expandedPurchase === p.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                        style={{ color: '#4a90e2', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td><span style={{ color: '#6c7a9e', fontSize: '0.85rem' }}>#{p.id}</span></td>
                    <td>{formatDate(p.date)}</td>
                    <td>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-truck" style={{ color: '#4a90e2' }} />
                        {p.supplier}
                      </span>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-person-fill" style={{ color: '#6c7a9e' }} />
                        {p.user}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="fw-bold" style={{ color: '#0f2044' }}>{fmt(p.total)}</span>
                    </td>
                  </tr>

                  {expandedPurchase === p.id && (
                    <tr key={`detail-${p.id}`}>
                      <td colSpan={6} style={{ padding: '0 16px 12px 56px', background: '#f4f7fb' }}>
                        {loadingDetails[p.id] ? (
                          <div className="py-2 text-muted small">
                            <span className="spinner-border spinner-border-sm me-2" />
                            Cargando productos...
                          </div>
                        ) : (purchaseDetails[p.id] ?? []).length === 0 ? (
                          <div className="py-2 text-muted small">Sin detalles registrados.</div>
                        ) : (
                          <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ color: '#6c7a9e', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                                <th style={{ padding: '6px 8px', borderBottom: '1px solid #d1dbe8' }}>Producto</th>
                                <th style={{ padding: '6px 8px', borderBottom: '1px solid #d1dbe8', textAlign: 'center' }}>Cantidad</th>
                                <th style={{ padding: '6px 8px', borderBottom: '1px solid #d1dbe8', textAlign: 'right' }}>Precio c/u</th>
                                <th style={{ padding: '6px 8px', borderBottom: '1px solid #d1dbe8', textAlign: 'right' }}>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {purchaseDetails[p.id].map((d, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #edf0f5' }}>
                                  <td style={{ padding: '6px 8px' }}>
                                    <span className="d-flex align-items-center gap-1">
                                      <i className="bi bi-box-seam" style={{ color: '#4a90e2', fontSize: '0.8rem' }} />
                                      {d.product}
                                    </span>
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <span style={{ background: '#e8f0fe', color: '#1a56db', borderRadius: 12, padding: '2px 10px', fontSize: '0.78rem', fontWeight: 700 }}>
                                      {d.quantity} uds
                                    </span>
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'right', color: '#6c7a9e' }}>
                                    {fmt(d.unitPrice)}
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700, color: '#0f2044' }}>
                                    {fmt(d.unitPrice * d.quantity)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f7f9fc' }}>
                <td colSpan={5} className="text-end fw-semibold" style={{ fontSize: '0.875rem', color: '#6c7a9e' }}>
                  Total del período:
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="fw-bold" style={{ color: '#0f2044', fontSize: '1rem' }}>
                    {fmt(purchases.reduce((acc, p) => acc + p.total, 0))}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  )
}
