# Papel y Magia — Stationery App

Aplicación web fullstack para la gestión de una papelería / negocio físico pequeño.  
Incluye un **backend REST** con Spring Boot + JWT y un **frontend** en React + Vite + Bootstrap con interfaz profesional.

---

## Tabla de contenidos

1. [Tecnologías](#tecnologías)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Requisitos previos](#requisitos-previos)
4. [Configuración y arranque](#configuración-y-arranque)
5. [Funcionalidades](#funcionalidades)
6. [Endpoints del API](#endpoints-del-api)
7. [Frontend — módulos](#frontend--módulos)
8. [Autenticación y roles](#autenticación-y-roles)
9. [Pruebas manuales con archivos .http](#pruebas-manuales-con-archivos-http)
10. [Swagger / OpenAPI](#swagger--openapi)

---

## Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.6 |
| Spring Security + JWT (jjwt) | 0.13.0 |
| Spring Data JPA | — |
| PostgreSQL | — |
| Lombok | — |
| springdoc-openapi (Swagger UI) | — |
| Maven | — |

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 7 |
| TypeScript | — |
| Bootstrap 5 | — |
| Bootstrap Icons | — |
| React Router DOM | 7 |

---

## Estructura del proyecto

```
stationery-app/
├── src/                        # Backend Spring Boot
│   └── main/java/.../
│       ├── config/             # Spring Security, CORS, JWT filter
│       ├── controllers/        # Controladores REST
│       ├── models/
│       │   ├── dtos/           # Request / Response DTOs
│       │   ├── entities/       # Entidades JPA
│       │   └── mappers/        # Conversión entidad <-> DTO
│       ├── repository/         # Repositorios Spring Data
│       ├── services/           # Lógica de negocio
│       ├── globlalExceptions/  # Manejo global de errores
│       └── security/           # JWT utils, filtros
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── api/                # Función centralizada apiFetch
│   │   ├── auth/               # AuthContext (JWT + user info)
│   │   ├── components/         # AppLayout (sidebar + header)
│   │   └── pages/              # Una página por módulo
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── pruebasHttp/                # Archivos .http para pruebas manuales
└── README.md
```

---

## Requisitos previos

- **JDK 21** instalado.
- **Node.js 18+** y **npm** instalados.
- **Maven** (o usar el wrapper `mvnw` incluido).
- Una instancia de **PostgreSQL** accesible.

---

## Configuración y arranque

### 1. Base de datos

Crea una base de datos en PostgreSQL y configura la conexión en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/stationery_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```

> Con `ddl-auto=update` JPA crea o actualiza las tablas automáticamente al arrancar.

### 2. Arrancar el backend

Desde la raíz del proyecto:

```bash
# Con Maven instalado
mvn spring-boot:run

# O con el wrapper
./mvnw spring-boot:run
```

El backend queda disponible en: `http://localhost:8081`

### 3. Arrancar el frontend

```bash
cd frontend
npm install      # solo la primera vez
npm run dev
```

El frontend queda disponible en: `http://localhost:5173`

> **Importante:** el backend debe estar corriendo para que el frontend funcione.

---

## Funcionalidades

### Autenticación
- Login con **correo electrónico** y contraseña, devuelve JWT.
- Registro público de nuevos usuarios con selección de rol.
- Sesión persistente vía `localStorage` (token + datos del usuario).

### Productos
- CRUD completo (crear, ver, editar, eliminar).
- Visualización de stock actual con badge de color (bajo / normal).
- Búsqueda en tiempo real por nombre o ID.

### Inventario
- Listado de productos ordenado de **menor a mayor stock**.
- Umbral de alerta configurable con slider.
- Código de colores: Agotado / Bajo stock / Precaución / Suficiente.

### Ventas
- Registro de ventas con múltiples líneas de producto.
- Validación de stock en tiempo real: no permite vender más de lo disponible.
- Campo de **nota u observación** opcional por venta (ej: "cliente debe $10.000").
- Historial con filtro por rango de fechas.
- **Detalles expandibles**: al hacer clic en una venta se despliegan los productos vendidos con cantidad y subtotal.
- Indicador visual (📌) en ventas que tienen nota.

### Compras
- Registro de compras con proveedor obligatorio y múltiples líneas de producto.
- Aviso si no hay proveedores registrados.
- Aviso si el precio de compra es menor al precio de venta del producto.
- Historial con filtro por rango de fechas.
- **Detalles expandibles**: al hacer clic en una compra se despliegan los productos comprados.

### Proveedores
- CRUD completo (nombre, prefijo, teléfono, dirección, email, NIT).
- Búsqueda en tiempo real.

### Usuarios
- CRUD completo con selección de rol (ADMINISTRADOR / EMPLEADO).
- Acceso restringido a usuarios con rol ADMINISTRADOR.

### Reportes
- Productos más vendidos en un rango de fechas con límite configurable.
- Visualización con barras de progreso y ranking.

### Dashboard
- KPIs en tiempo real: total de productos, bajo stock, ventas del día, ingresos del día.
- Accesos directos a todos los módulos.
- Alerta si hay productos con bajo stock.

---

## Endpoints del API

> Todos los endpoints (salvo login, registro público y roles) requieren el header:
> ```
> Authorization: Bearer <token_jwt>
> ```

### Autenticación

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| POST | `/api/login` | Público | Login — devuelve JWT |
| POST | `/api/auth/signup` | Público | Registro de nuevo usuario con rol |
| POST | `/api/auth/register` | ADMINISTRADOR | Registro de usuario por admin |

### Productos

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/products` | Autenticado | Lista todos los productos |
| GET | `/api/products/{id}` | Autenticado | Obtiene un producto por ID |
| GET | `/api/products/low-stock?threshold=N` | Autenticado | Productos con stock ≤ umbral |
| GET | `/api/products/by-stock-asc` | Autenticado | Productos ordenados por stock asc. |
| POST | `/api/products` | ADMINISTRADOR | Crea un producto |
| PUT | `/api/products/{id}` | ADMINISTRADOR | Actualiza un producto |
| DELETE | `/api/products/{id}` | ADMINISTRADOR | Elimina un producto |

### Ventas

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/sales` | Autenticado | Lista todas las ventas |
| GET | `/api/sales/by-date?start=&end=` | Autenticado | Ventas en rango de fechas |
| GET | `/api/sales/by-month?year=&month=` | Autenticado | Ventas de un mes |
| GET | `/api/sales/top-products?start=&end=&limit=N` | Autenticado | Productos más vendidos |
| POST | `/api/sales` | ADMIN / EMPLEADO | Crea una venta |
| PUT | `/api/sales/{id}` | ADMINISTRADOR | Actualiza una venta |
| DELETE | `/api/sales/{id}` | ADMINISTRADOR | Elimina una venta |

### Detalle de ventas

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/salesDetails` | Autenticado | Lista todos los detalles |
| GET | `/api/salesDetails/bySale/{idSale}` | Autenticado | Detalles de una venta específica |
| POST | `/api/salesDetails` | ADMINISTRADOR | Crea un detalle |
| PUT | `/api/salesDetails/{idSale}/{idProduct}` | ADMINISTRADOR | Actualiza un detalle |
| DELETE | `/api/salesDetails/{idSale}/{idProduct}` | ADMINISTRADOR | Elimina un detalle |

### Compras

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/purchases` | Autenticado | Lista todas las compras |
| GET | `/api/purchases/by-date?start=&end=` | Autenticado | Compras en rango de fechas |
| GET | `/api/purchases/by-supplier/{id}` | Autenticado | Compras de un proveedor |
| POST | `/api/purchases` | ADMIN / EMPLEADO | Crea una compra |
| PUT | `/api/purchases/{id}` | ADMIN / EMPLEADO | Actualiza una compra |
| DELETE | `/api/purchases/{id}` | ADMINISTRADOR | Elimina una compra |

### Detalle de compras

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/purchasesDetails` | Autenticado | Lista todos los detalles |
| GET | `/api/purchasesDetails/byPurchase/{id}` | Autenticado | Detalles de una compra específica |
| POST | `/api/purchasesDetails` | ADMINISTRADOR | Crea un detalle |
| PUT | `/api/purchasesDetails/{idPurchase}/{idProduct}` | ADMINISTRADOR | Actualiza un detalle |
| DELETE | `/api/purchasesDetails/{idPurchase}/{idProduct}` | ADMINISTRADOR | Elimina un detalle |

### Proveedores

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/suppliers` | Autenticado | Lista todos los proveedores |
| POST | `/api/suppliers` | ADMINISTRADOR | Crea un proveedor |
| PUT | `/api/suppliers/{id}` | ADMINISTRADOR | Actualiza un proveedor |
| DELETE | `/api/suppliers/{id}` | ADMINISTRADOR | Elimina un proveedor |

### Usuarios y roles

| Método | Endpoint | Acceso | Descripción |
|--------|----------|--------|-------------|
| GET | `/api/users` | Autenticado | Lista todos los usuarios |
| PUT | `/api/users/{id}` | ADMINISTRADOR | Actualiza un usuario |
| DELETE | `/api/users/{id}` | ADMINISTRADOR | Elimina un usuario |
| GET | `/api/roles` | Público | Lista todos los roles |

---

## Frontend — módulos

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/login` | Login | Inicio de sesión con email |
| `/signup` | Registro | Registro público con selección de rol |
| `/` | Dashboard | KPIs, accesos rápidos, alertas de stock |
| `/products` | Productos | CRUD completo de productos |
| `/inventory` | Inventario | Stock ordenado con alertas visuales |
| `/sales` | Ventas | Historial, registro y detalles expandibles |
| `/purchases` | Compras | Historial, registro y detalles expandibles |
| `/suppliers` | Proveedores | CRUD completo de proveedores |
| `/users` | Usuarios | CRUD completo de usuarios (solo admin) |
| `/reports` | Reportes | Productos más vendidos con gráfica |

---

## Autenticación y roles

El sistema maneja dos roles:

| Rol | Permisos |
|-----|----------|
| `ADMINISTRADOR` | Acceso completo: crear, editar, eliminar en todos los módulos |
| `EMPLEADO` | Solo lectura y registro de ventas/compras; sin acceso a CRUD de catálogo |

Los botones de acción (Crear, Editar, Eliminar) se ocultan automáticamente en el frontend para usuarios con rol `EMPLEADO`.

---

## Pruebas manuales con archivos .http

En la carpeta `pruebasHttp/` hay archivos listos para usar con el cliente HTTP de VS Code / IntelliJ:

- `login.http` → obtener token JWT
- `User.http` → operaciones sobre usuarios
- `products.http` → operaciones sobre productos
- `purchases.http`, `sales.http`, `suppliers.http`, etc.

Ejemplo:

```http
### Login
POST http://localhost:8081/api/login
Content-Type: application/json

{
  "username": "correo@ejemplo.com",
  "password": "tu_contraseña"
}

### Listar productos (con token)
GET http://localhost:8081/api/products
Authorization: Bearer {{token}}
Accept: application/json
```

---

## Swagger / OpenAPI

Con el backend en marcha, la documentación interactiva está disponible en:

- `http://localhost:8081/swagger-ui/index.html`

Permite explorar y probar todos los endpoints directamente desde el navegador.
