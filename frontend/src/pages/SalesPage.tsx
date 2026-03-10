import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api/api'

interface Sale {
  id: number
  salesDate: string
  total: number
  user: string
  notes?: string
}

interface SaleDetail {
  idSale: number
  product: string
  quantity: number
  unitPrice: number
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

export function SalesPage() {
  const { token, user } = useAuth()
  const [sales, setSales]       = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const [showForm, setShowForm]     = useState(false)
  const [lines, setLines]           = useState<LineItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity]     = useState(1)
  const [saleNotes, setSaleNotes]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)

  const [filterStart, setFilterStart] = useState('')
  const [filterEnd, setFilterEnd]     = useState('')

  // Detalles expandibles por venta
  const [expandedSale, setExpandedSale]             = useState<number | null>(null)
  const [saleDetails, setSaleDetails]               = useState<Record<number, SaleDetail[]>>({})
  const [loadingDetails, setLoadingDetails]         = useState<Record<number, boolean>>({})

  const fetchSales = async () => {
    try {
      setLoading(true)
      let url = '/api/sales'
      if (filterStart && filterEnd) url = `/api/sales/by-date?start=${filterStart}&end=${filterEnd}`
      const data = await apiFetch<Sale[]>(url, { token })
      setSales(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar ventas')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<Product[]>('/api/products', { token })
      setProducts(data)
    } catch { /* silent */ }
  }

  useEffect(() => { fetchSales(); fetchProducts() }, [])

  const toggleDetails = async (saleId: number) => {
    if (expandedSale === saleId) { setExpandedSale(null); return }
    setExpandedSale(saleId)
    if (saleDetails[saleId]) return   // ya cargados

    setLoadingDetails((prev) => ({ ...prev, [saleId]: true }))
    try {
      const data = await apiFetch<SaleDetail[]>(`/api/salesDetails/bySale/${saleId}`, { token })
      setSaleDetails((prev) => ({ ...prev, [saleId]: data }))
    } catch { /* silent */ } finally {
      setLoadingDetails((prev) => ({ ...prev, [saleId]: false }))
    }
  }

  const handleFilter = () => fetchSales()
  const clearFilter  = () => { setFilterStart(''); setFilterEnd(''); setTimeout(fetchSales, 0) }

  // Calcula cuántas unidades de un producto ya están en el carrito
  const qtyInCart = (productId: string) =>
    lines.find((l) => l.product.id === productId)?.quantity ?? 0

  const selectedProd = products.find((p) => p.id === selectedProduct)
  const maxQtyForSelected = selectedProd
    ? selectedProd.currentStock - qtyInCart(selectedProd.id)
    : 0

  const addLine = () => {
    const prod = selectedProd
    if (!prod) return
    setFormError(null)

    const alreadyInCart = qtyInCart(prod.id)
    if (alreadyInCart + quantity > prod.currentStock) {
      setFormError(
        `Stock insuficiente para "${prod.name}". ` +
        `Disponible: ${prod.currentStock} uds, ya en la venta: ${alreadyInCart}.`
      )
      return
    }

    const existingIdx = lines.findIndex((l) => l.product.id === prod.id)
    if (existingIdx >= 0) {
      const updated = [...lines]
      updated[existingIdx].quantity += quantity
      setLines(updated)
    } else {
      setLines([...lines, { product: prod, quantity, unitPrice: prod.unitPrice }])
    }
    setSelectedProduct('')
    setQuantity(1)
  }

  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx))

  const updateLineQty = (idx: number, qty: number) => {
    const line = lines[idx]
    const capped = Math.max(1, Math.min(qty, line.product.currentStock))
    const updated = [...lines]
    updated[idx].quantity = capped
    setLines(updated)
  }

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)

  const handleCreateSale = async () => {
    if (!user) { setFormError('No se pudo identificar el usuario. Vuelve a iniciar sesión.'); return }
    if (lines.length === 0) { setFormError('Agrega al menos un producto.'); return }

    // Validación final de stock
    for (const l of lines) {
      if (l.quantity > l.product.currentStock) {
        setFormError(`Stock insuficiente para "${l.product.name}" (disponible: ${l.product.currentStock}).`)
        return
      }
    }

    setFormError(null)
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const created = await apiFetch<Sale>('/api/sales', {
        token, method: 'POST',
        body: { salesDate: today, total, user: user.id, notes: saleNotes.trim() || null },
      })

      await Promise.all(
        lines.map((l) =>
          apiFetch('/api/salesDetails', {
            token, method: 'POST',
            body: { idSale: created.id, idProduct: l.product.id, quantity: l.quantity, unitPrice: l.unitPrice },
          })
        )
      )
      setFormSuccess(true)
      setLines([])
      setSaleNotes('')
      setTimeout(() => { setFormSuccess(false); setShowForm(false); fetchSales(); fetchProducts() }, 1800)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al registrar la venta')
    } finally {
      setSaving(false)
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })

  const stockColor = (stock: number) =>
    stock === 0 ? '#e63946' : stock <= 5 ? '#f4a261' : '#2ec4b6'

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ventas</h1>
          <div className="page-title-sub">Historial y registro de ventas</div>
        </div>
        <button
          className="btn-navy"
          onClick={() => { setShowForm(!showForm); setFormError(null); setFormSuccess(false); setLines([]); setSaleNotes('') }}
        >
          <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-lg'}`} />
          {showForm ? 'Cancelar' : 'Registrar venta'}
        </button>
      </div>

      {/* ── Formulario nueva venta ── */}
      {showForm && (
        <div className="table-card mb-4 p-4">
          <h5 className="fw-bold mb-3" style={{ color: '#0f2044' }}>
            <i className="bi bi-bag-check-fill me-2" style={{ color: '#4a90e2' }} />
            Nueva Venta
          </h5>

          {formError && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-circle-fill" />
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="alert alert-success py-2 small d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill" />
              ¡Venta registrada exitosamente!
            </div>
          )}

          {/* Selector de producto + cantidad */}
          <div className="row g-2 align-items-end mb-2">
            <div className="col-md-6">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={selectedProduct}
                onChange={(e) => { setSelectedProduct(e.target.value); setQuantity(1); setFormError(null) }}
              >
                <option value="">— Selecciona un producto —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.currentStock === 0}>
                    {p.name} — {fmt(p.unitPrice)}
                    {p.currentStock === 0 ? ' (Sin stock)' : ` (Stock: ${p.currentStock})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Indicador de stock disponible */}
            {selectedProd && (
              <div className="col-md-2">
                <label className="form-label">Disponible</label>
                <div
                  className="form-control text-center fw-bold"
                  style={{ color: stockColor(maxQtyForSelected), background: '#f7f9fc', cursor: 'default' }}
                >
                  {maxQtyForSelected} uds
                </div>
              </div>
            )}

            <div className="col-md-2">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={maxQtyForSelected}
                value={quantity}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 1
                  setQuantity(Math.min(v, maxQtyForSelected || v))
                }}
                disabled={!selectedProduct}
              />
            </div>

            <div className="col-md-2">
              <button
                className="btn-navy w-100"
                onClick={addLine}
                disabled={!selectedProduct || quantity < 1 || maxQtyForSelected < 1}
                style={{ padding: '8px 12px' }}
              >
                <i className="bi bi-plus-lg" />
                Agregar
              </button>
            </div>
          </div>

          {selectedProd && maxQtyForSelected < 1 && (
            <div className="small mb-2" style={{ color: '#e63946' }}>
              <i className="bi bi-exclamation-triangle-fill me-1" />
              Sin stock disponible para este producto.
            </div>
          )}

          {/* Líneas de venta */}
          {lines.length === 0 ? (
            <div
              className="text-center py-3 text-muted mt-2"
              style={{ background: '#f7f9fc', borderRadius: 8, border: '1.5px dashed #d1dbe8' }}
            >
              <i className="bi bi-bag" style={{ fontSize: '1.5rem', opacity: 0.4 }} />
              <div className="mt-1 small">No hay productos en esta venta aún</div>
            </div>
          ) : (
            <div className="mb-3 mt-2">
              {/* Cabecera de columnas */}
              <div
                className="d-flex align-items-center gap-2 mb-1 px-2"
                style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6c7a9e', textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                <div className="flex-grow-1">Producto</div>
                <div style={{ width: 90 }}>Stock disp.</div>
                <div style={{ width: 80 }}>Cantidad</div>
                <div style={{ width: 110, textAlign: 'right' }}>Subtotal</div>
                <div style={{ width: 32 }} />
              </div>

              {lines.map((l, idx) => {
                const overStock = l.quantity > l.product.currentStock
                return (
                  <div
                    key={idx}
                    className="line-item-row"
                    style={{ borderColor: overStock ? '#e63946' : undefined, background: overStock ? '#fff5f5' : undefined }}
                  >
                    <div className="flex-grow-1">
                      <div className="product-name">{l.product.name}</div>
                      <div className="product-price">{fmt(l.unitPrice)} c/u</div>
                    </div>
                    {/* Stock disponible */}
                    <div style={{ width: 90, textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: stockColor(l.product.currentStock),
                        }}
                      >
                        {l.product.currentStock} uds
                      </span>
                    </div>
                    {/* Cantidad editable con límite */}
                    <div style={{ width: 80 }}>
                      <input
                        type="number"
                        className={`form-control form-control-sm text-center ${overStock ? 'is-invalid' : ''}`}
                        min={1}
                        max={l.product.currentStock}
                        value={l.quantity}
                        onChange={(e) => updateLineQty(idx, parseInt(e.target.value, 10) || 1)}
                      />
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
                )
              })}

              {lines.some((l) => l.quantity > l.product.currentStock) && (
                <div className="alert alert-warning py-2 small mt-2 d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill" />
                  Hay líneas con cantidad mayor al stock disponible. Corrígelas antes de confirmar.
                </div>
              )}

              <div className="d-flex justify-content-end mt-2">
                <div className="px-3 py-2 rounded-3" style={{ background: '#0f2044', color: 'white' }}>
                  <span className="me-2">Total:</span>
                  <strong style={{ fontSize: '1.1rem' }}>{fmt(total)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Nota / observación */}
          <div className="mt-3">
            <label className="form-label d-flex align-items-center gap-1">
              <i className="bi bi-sticky-fill" style={{ color: '#f4a261' }} />
              Nota u observación
              <span className="text-muted small ms-1">(opcional — ej: cliente debe dinero)</span>
            </label>
            <textarea
              className="form-control"
              rows={2}
              maxLength={500}
              placeholder="Ej: Cliente quedó debiendo $10.000, paga el viernes..."
              value={saleNotes}
              onChange={(e) => setSaleNotes(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.88rem' }}
            />
            <div className="text-end small text-muted mt-1">{saleNotes.length}/500</div>
          </div>

          <div className="d-flex gap-2 justify-content-end mt-3">
            <button className="btn btn-secondary" onClick={() => { setShowForm(false); setLines([]); setSaleNotes('') }}>
              Cancelar
            </button>
            <button
              className="btn-navy"
              onClick={handleCreateSale}
              disabled={saving || lines.length === 0 || lines.some((l) => l.quantity > l.product.currentStock)}
            >
              {saving
                ? <><span className="spinner-border spinner-border-sm me-1" />Registrando...</>
                : <><i className="bi bi-check-lg me-1" />Confirmar venta</>
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
            <div>Cargando ventas...</div>
          </div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-bag-check" />
            <div>No hay ventas registradas</div>
          </div>
        ) : (
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                <th>#</th>
                <th>Fecha</th>
                <th>Vendedor</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <>
                  <tr key={s.id} style={{ cursor: 'pointer' }} onClick={() => toggleDetails(s.id)}>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <i
                        className={`bi ${expandedSale === s.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                        style={{ color: '#4a90e2', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td><span style={{ color: '#6c7a9e', fontSize: '0.85rem' }}>#{s.id}</span></td>
                    <td>{formatDate(s.salesDate)}</td>
                    <td>
                      <span className="d-flex align-items-center gap-1">
                        <i className="bi bi-person-fill" style={{ color: '#4a90e2' }} />
                        {s.user}
                        {s.notes && (
                          <i
                            className="bi bi-sticky-fill ms-1"
                            style={{ color: '#f4a261', fontSize: '0.8rem' }}
                            title={s.notes}
                          />
                        )}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="fw-bold" style={{ color: '#0f2044' }}>{fmt(s.total)}</span>
                    </td>
                  </tr>

                  {expandedSale === s.id && (
                    <tr key={`detail-${s.id}`}>
                      <td colSpan={5} style={{ padding: '0 16px 12px 48px', background: '#f4f7fb' }}>
                        {/* Nota de la venta */}
                        {s.notes && (
                          <div
                            className="d-flex align-items-start gap-2 mt-2 mb-2 px-2 py-2 rounded-2"
                            style={{ background: '#fffbf0', border: '1px solid #f4d261', fontSize: '0.83rem', color: '#7a6200' }}
                          >
                            <i className="bi bi-sticky-fill mt-1" style={{ color: '#f4a261', flexShrink: 0 }} />
                            <span>{s.notes}</span>
                          </div>
                        )}

                        {loadingDetails[s.id] ? (
                          <div className="py-2 text-muted small">
                            <span className="spinner-border spinner-border-sm me-2" />
                            Cargando productos...
                          </div>
                        ) : (saleDetails[s.id] ?? []).length === 0 ? (
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
                              {saleDetails[s.id].map((d, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #edf0f5' }}>
                                  <td style={{ padding: '6px 8px' }}>
                                    <span className="d-flex align-items-center gap-1">
                                      <i className="bi bi-box-seam" style={{ color: '#4a90e2', fontSize: '0.8rem' }} />
                                      {d.product}
                                    </span>
                                  </td>
                                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                    <span
                                      className="fw-bold"
                                      style={{
                                        background: '#e8f0fe',
                                        color: '#1a56db',
                                        borderRadius: 12,
                                        padding: '2px 10px',
                                        fontSize: '0.78rem',
                                      }}
                                    >
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
                <td colSpan={4} className="text-end fw-semibold" style={{ fontSize: '0.875rem', color: '#6c7a9e' }}>
                  Total del período:
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="fw-bold" style={{ color: '#0f2044', fontSize: '1rem' }}>
                    {fmt(sales.reduce((acc, v) => acc + v.total, 0))}
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
