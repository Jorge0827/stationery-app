## Stationery App - Backend

Aplicación backend para la gestión de una papelería / negocio físico pequeño.  
Está construida con **Spring Boot 3**, **Java 21**, **JWT** para autenticación y **PostgreSQL** como base de datos.

### Funcionalidades principales

- **Autenticación y seguridad**
  - Login con **JWT**.
  - Configuración de seguridad con **Spring Security**.
  - Roles de usuario (por ejemplo, `ADMINISTRADOR` y `EMPLEADO`) para proteger endpoints.

- **Gestión de catálogo**
  - CRUD de **productos**, con precio unitario y stock actual.
  - CRUD de **proveedores**.
  - CRUD de **usuarios** y **roles**.

- **Compras**
  - Registro de compras a proveedores.
  - Asociación de compras con proveedor y usuario.
  - Detalle de compras (productos comprados, cantidad, precio).
  - Consultas por rango de fechas y por proveedor.

- **Ventas**
  - Registro de ventas realizadas por los empleados.
  - Detalle de ventas (productos vendidos, cantidad, precio).
  - Consultas por rango de fechas y por mes.
  - Reporte de **productos más vendidos** en un rango de fechas.

- **Inventario / stock**
  - Consulta de productos con **bajo stock** (umbral configurable).
  - Listado de productos ordenados por stock ascendente para ver rápido qué se está agotando.

- **Documentación**
  - Integración con **OpenAPI / Swagger UI** para explorar y probar la API desde el navegador.

---

### Tecnologías

- **Java 21**
- **Spring Boot 3.5.6**
  - spring-boot-starter-web
  - spring-boot-starter-data-jpa
  - spring-boot-starter-security
  - spring-boot-starter-validation
- **JWT (jjwt 0.13.0)**
- **PostgreSQL** (driver oficial)
- **Lombok**
- **springdoc-openapi** para Swagger UI
- **Maven** como gestor de dependencias

---

### Requisitos previos

- JDK **21** instalado.
- **Maven** (opcional si usas el wrapper `mvnw`).
- Una instancia de **PostgreSQL** accesible.

---

### Configuración de base de datos

La configuración de la base de datos se hace en `src/main/resources/application.properties`.  
Asegúrate de tener la URL, usuario y contraseña correctos para tu entorno, por ejemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/stationery_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```

Adapta estos valores según tu configuración local.

---

### Cómo ejecutar el proyecto

Desde la raíz del proyecto (`stationery-app`):

```bash
# Con Maven instalado
mvn spring-boot:run

# O con el wrapper (Windows PowerShell)
./mvnw spring-boot:run
```

Por defecto la aplicación expone la API en:

- `http://localhost:8081` (según tu configuración actual).

---

### Autenticación y seguridad

1. **Login**
   - Endpoint: `POST /api/login`
   - Envías credenciales de usuario y recibes un **JWT**.

2. **Uso del token**
   - Debes enviar el token en la cabecera:

   ```http
   Authorization: Bearer <tu_token_jwt>
   ```

3. **Roles**
   - Muchos endpoints están protegidos con:
     - `@PreAuthorize("isAuthenticated()")` → cualquier usuario logueado.
     - `@PreAuthorize("hasAnyRole('ADMINISTRADOR', 'EMPLEADO')")`
     - `@PreAuthorize("hasRole('ADMINISTRADOR')")`

---

### Endpoints principales (resumen)

#### Productos (`/api/products`)

- `GET /api/products`
  - Lista todos los productos.

- `GET /api/products/low-stock?threshold=10`
  - Devuelve productos con `currentStock <= threshold` (si no se envía, el umbral por defecto es 10).

- `GET /api/products/by-stock-asc`
  - Lista todos los productos ordenados por stock ascendente.

- `POST /api/products` (ADMINISTRADOR)
  - Crea un nuevo producto.

- `PUT /api/products/{id}` (ADMINISTRADOR)
  - Actualiza un producto existente (incluye lógica para cambiar ID si es necesario).

- `DELETE /api/products/{id}` (ADMINISTRADOR)
  - Elimina un producto.

#### Ventas (`/api/sales`)

- `GET /api/sales`
  - Lista todas las ventas.

- `GET /api/sales/by-date?start=YYYY-MM-DD&end=YYYY-MM-DD`
  - Ventas entre dos fechas (incluyendo ambos días).

- `GET /api/sales/by-month?year=YYYY&month=MM`
  - Ventas de un mes concreto.

- `GET /api/sales/top-products?start=YYYY-MM-DD&end=YYYY-MM-DD&limit=N`
  - **Reporte de productos más vendidos** en el rango:
    - `productId`, `productName`, `totalQuantity`, `totalAmount`.
    - `limit` es opcional, por defecto se usan 5 productos.

- `POST /api/sales` (ADMINISTRADOR o EMPLEADO)
  - Crea una nueva venta.

- `PUT /api/sales/{id}` (ADMINISTRADOR)
  - Actualiza una venta existente.

- `DELETE /api/sales/{id}` (ADMINISTRADOR)
  - Elimina una venta.

#### Compras (`/api/purchases`)

- `GET /api/purchases`
  - Lista todas las compras.

- `GET /api/purchases/by-date?start=YYYY-MM-DD&end=YYYY-MM-DD`
  - Compras entre dos fechas.

- `GET /api/purchases/by-supplier/{supplierId}`
  - Historial de compras de un proveedor concreto.

- `POST /api/purchases` (ADMINISTRADOR o EMPLEADO)
  - Crea una nueva compra asociada a proveedor y usuario.

- `PUT /api/purchases/{id}` (ADMINISTRADOR o EMPLEADO)
  - Actualiza una compra existente.

- `DELETE /api/purchases/{id}` (ADMINISTRADOR)
  - Elimina una compra.

#### Proveedores (`/api/suppliers`)

- `GET /api/suppliers`
  - Lista todos los proveedores.
- `POST /api/suppliers` (ADMINISTRADOR)
  - Crea proveedor (valida email y NIT únicos).
- `PUT /api/suppliers/{id}` (ADMINISTRADOR)
  - Actualiza un proveedor.
- `DELETE /api/suppliers/{id}` (ADMINISTRADOR)
  - Elimina un proveedor.

#### Usuarios y roles

- `GET /api/users`, `POST /api/users`, etc.
- `GET /api/roles`, `POST /api/roles`, etc.

Los controladores y servicios correspondientes gestionan la creación de usuarios, asignación de roles y validaciones de negocio.

---

### Pruebas manuales con archivos `.http`

En la carpeta `pruebasHttp/` tienes varios archivos listos para usar (por ejemplo, con las extensiones de HTTP Client de VS Code / IntelliJ):

- `login.http` → para obtener un token JWT.
- `User.http` → operaciones sobre usuarios.
- `products.http` → operaciones sobre productos (incluye consultas al nuevo backend).
- `purchases.http`, `saleDetail.http`, `sales.http`, `suppliers.http`, etc.

Ejemplo básico de una petición con token:

```http
### Listar productos
GET http://localhost:8081/api/products
Authorization: Bearer {{token}}
Accept: application/json
```

Actualiza la variable `{{token}}` o pega directamente tu JWT válido.

---

### Swagger / OpenAPI

Cuando la aplicación está en marcha, puedes acceder a la documentación interactiva de la API en:

- `http://localhost:8081/swagger-ui.html`
  o
- `http://localhost:8081/swagger-ui/index.html`

Ahí puedes probar endpoints, ver modelos de datos y respuestas.

---

### Futuras mejoras interesantes

- Reportes adicionales (por cliente, por forma de pago, comparativas mes a mes).
- Manejo de devoluciones / notas de crédito.
- Integración con un sistema contable o una app móvil.

Este README resume la estructura actual del proyecto y los endpoints clave para operar la papelería de forma cómoda desde un cliente frontend o herramientas como Postman / HTTP Client.

