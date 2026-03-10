import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { DashboardPage }  from './pages/DashboardPage'
import { LoginPage }      from './pages/LoginPage'
import { SignupPage }     from './pages/SignupPage'
import { ProductsPage }   from './pages/ProductsPage'
import { InventoryPage }  from './pages/InventoryPage'
import { SuppliersPage }  from './pages/SuppliersPage'
import { PurchasesPage }  from './pages/PurchasesPage'
import { SalesPage }      from './pages/SalesPage'
import { ReportsPage }    from './pages/ReportsPage'
import { UsersPage }      from './pages/UsersPage'
import { AppLayout }      from './components/AppLayout'
import { useAuth }        from './auth/AuthContext'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

export function App() {
  return (
    <Routes>
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index              element={<DashboardPage />} />
        <Route path="products"   element={<ProductsPage />} />
        <Route path="inventory"  element={<InventoryPage />} />
        <Route path="suppliers"  element={<SuppliersPage />} />
        <Route path="purchases"  element={<PurchasesPage />} />
        <Route path="sales"      element={<SalesPage />} />
        <Route path="reports"    element={<ReportsPage />} />
        <Route path="users"      element={<UsersPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
