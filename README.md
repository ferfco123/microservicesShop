# 🛍️ E-Commerce Microservices Architecture

Un ecosistema e-commerce completo, moderno y escalable desarrollado como un **monorepo** impulsado por **Turborepo** y **pnpm Workspaces**.

La plataforma utiliza una **arquitectura basada en microservicios**, comunicación asíncrona guiada por eventos (**Event-Driven Architecture**) mediante **Apache Kafka**, y separación estricta de responsabilidades entre el catálogo de productos, procesamiento de pagos, gestión de órdenes y notificaciones.

---

## 🏗️ Arquitectura del Sistema

La arquitectura está dividida en tres capas principales:

- **Frontend:** aplicaciones React desplegadas en Vercel.
- **Backend:** microservicios independientes desplegados en Oracle Cloud.
- **Event Bus:** Apache Kafka alojado en Aiven Cloud.

```text
                              ┌─────────────────────────────┐
                              │          VERCEL             │
                              │                             │
                              │   ┌─────────┐ ┌──────────┐ │
                              │   │ Client  │ │Dashboard │ │
                              │   │ React19 │ │ React 19 │ │
                              │   └────┬────┘ └────┬─────┘ │
                              └────────┼───────────┼───────┘
                                       │           │
                                       └─────┬─────┘
                                             │
                                             ▼
                              ┌─────────────────────────────┐
                              │       ORACLE CLOUD          │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │   Product Service      │  │
                              │  │     Express 5          │  │
                              │  └───────────┬───────────┘  │
                              │              │              │
                              │              ▼              │
                              │       ┌─────────────┐       │
                              │       │ PostgreSQL  │       │
                              │       │   Prisma    │       │
                              │       └─────────────┘       │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │   Payment Service     │  │
                              │  │        Hono           │  │
                              │  └───────────┬───────────┘  │
                              │              │              │
                              │              ▼              │
                              │         ┌────────┐          │
                              │         │ Stripe │          │
                              │         └────────┘          │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │    Order Service      │  │
                              │  │ Fastify + Node Cron    │  │
                              │  └───────────┬───────────┘  │
                              │              │              │
                              │              ▼              │
                              │         ┌─────────┐         │
                              │         │ MongoDB │         │
                              │         │ Mongoose│         │
                              │         └─────────┘         │
                              │                             │
                              │  ┌───────────────────────┐  │
                              │  │    Email Service      │  │
                              │  │       Node.js         │  │
                              │  │      Nodemailer        │  │
                              │  └───────────────────────┘  │
                              └──────────────┬──────────────┘
                                             │
                                             │ Eventos
                                             ▼
                              ┌─────────────────────────────┐
                              │        AIVEN CLOUD           │
                              │                             │
                              │      Apache Kafka           │
                              │                             │
                              │  product.created            │
                              │  product.updated            │
                              │  payment.succeeded           │
                              │  order.created               │
                              └─────────────────────────────┘
```

### Comunicación entre servicios

```text
                    ┌─────────────────┐
                    │     Client      │
                    │    React 19     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Product Service │
                    └────────┬────────┘
                             │
                             │ product.created
                             │ product.updated
                             ▼
                    ┌─────────────────┐
                    │ Apache Kafka    │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │  Payment   │ │   Order    │ │   Email    │
       │  Service   │ │  Service   │ │  Service   │
       └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
             │              │              │
             ▼              ▼              ▼
          Stripe         MongoDB       Nodemailer
```

---

# 📦 Estructura del Monorepo

El proyecto está organizado en dos grandes bloques dentro del monorepo: `apps/` y `packages/`.

```text
├── apps/
│
│   ├── client/
│   │   └── Storefront para clientes
│   │       React 19 + Vite
│   │
│   ├── dashboard/
│   │   └── Panel de administración
│   │       React 19 + Shadcn/ui
│   │
│   ├── auth-service/
│   │   └── Autenticación y verificación de sesiones
│   │       Express/Fastify + Clerk
│   │
│   ├── product-service/
│   │   └── Catálogo de productos y categorías
│   │       Express 5 + Prisma
│   │
│   ├── payment-service/
│   │   └── Procesamiento de pagos
│   │       Hono + Stripe
│   │
│   ├── order-service/
│   │   └── Gestión y persistencia de órdenes
│   │       Fastify + Node Cron
│   │
│   ├── email-service/
│   │   └── Emails transaccionales
│   │       Node.js + Nodemailer
│   │
│   └── kafka-init/
│       └── Inicialización de tópicos Kafka
│
└── packages/
    │
    ├── kafka/
    │   └── @repo/kafka
    │       Abstracción de KafkaJS
    │
    ├── productdb/
    │   └── @repo/productdb
    │       Prisma + PostgreSQL
    │
    ├── orderdb/
    │   └── @repo/orderdb
    │       Mongoose + MongoDB
    │
    ├── types/
    │   └── @repo/types
    │       Tipos TypeScript + esquemas Zod
    │
    ├── eslint-config/
    │   └── Configuración compartida de ESLint
    │
    └── typescript-config/
        └── Configuración compartida de TypeScript
```

---

# 🛠️ Tecnologías Utilizadas

## Frontend

- **React 19** — Biblioteca principal para las interfaces.
- **Vite** — Herramienta de desarrollo y build.
- **Tailwind CSS v4** — Estilizado y diseño responsivo.
- **Shadcn/ui** — Componentes accesibles y reutilizables.
- **TanStack Query v4** — Gestión del estado asíncrono y caché.
- **TanStack Table v8** — Tablas con paginación, filtros y ordenamiento.
- **Zustand** — Manejo del estado global del carrito.
- **React Router v7** — Enrutamiento de las aplicaciones SPA.
- **React Hook Form** — Gestión eficiente de formularios.
- **Zod** — Validación y definición de esquemas.
- **Clerk** — Autenticación, sesiones y RBAC.
- **Stripe React SDK** — Integración del checkout.
- **Recharts** — Gráficos estadísticos.
- **Lucide React** — Iconografía.
- **Canvas Confetti** — Animaciones de celebración.

## Backend & Microservicios

- **Express 5** — Framework utilizado en `product-service` y `auth-service`.
- **Hono** — Framework utilizado en `payment-service`.
- **Fastify** — Framework utilizado en `order-service`.
- **Node.js** — Runtime de los servicios backend.
- **Node Cron** — Tareas programadas.
- **Nodemailer** — Emails transaccionales.
- **Stripe Node.js SDK** — Integración con Stripe.
- **Stripe CLI** — Desarrollo y testing de webhooks.

## Bases de Datos & ORMs/ODMs

- **PostgreSQL** — Base de datos para productos y categorías.
- **Prisma ORM** — ORM utilizado con PostgreSQL.
- **@prisma/adapter-pg** — Adaptador de Prisma para PostgreSQL.
- **MongoDB** — Base de datos para órdenes.
- **Mongoose** — ODM utilizado con MongoDB.

## Infraestructura & Event-Driven Architecture

- **Apache Kafka** — Broker de eventos.
- **KafkaJS** — Cliente Node.js para Kafka.
- **Docker** — Contenedorización.
- **Docker Compose** — Orquestación del entorno local.
- **Aiven Cloud** — Infraestructura utilizada para Kafka.
- **Oracle Cloud** — Infraestructura utilizada para los servicios backend.
- **Vercel** — Hosting de las aplicaciones frontend.

## Monorepo, Calidad y Testing

- **Turborepo** — Gestión y build del monorepo.
- **pnpm Workspaces** — Gestión de dependencias.
- **TypeScript** — Tipado estático.
- **Vitest** — Testing unitario.
- **Supertest** — Testing de integración HTTP.
- **ESLint** — Linter compartido.
- **tsup** — Empaquetado de librerías internas.

---

# 🚀 Aplicaciones Frontend

Las aplicaciones frontend están desplegadas en **Vercel**.

---

# 🛒 1. Client — Storefront

**Port:** `3002`

Aplicación web orientada al cliente comprador.

## Tech Stack

- React 19
- Vite
- TanStack Query v4
- Zustand
- Clerk
- Stripe React SDK
- React Router v7
- React Hook Form
- Zod
- Lucide React
- Canvas Confetti

## Características

### 🏠 Home

Muestra los 8 productos destacados iniciales mediante componentes `CardItem`.

El usuario puede:

- Seleccionar variantes de color.
- Seleccionar talles.
- Filtrar productos por categoría.

### 🛍️ Catálogo & Ordenamiento

El catálogo permite ordenar los productos por:

- Más nuevo.
- Más viejo.
- Mayor precio.
- Menor precio.

### 📦 Detalle del Producto

Ruta:

```text
/product/:id
```

Permite visualizar:

- Descripción corta.
- Descripción detallada.
- Talles disponibles.
- Cantidad.
- Variantes de color.
- Imagen dinámica según la variante seleccionada.

### 🛒 Carrito de Compras

El carrito utiliza **Zustand** para manejar el estado global.

Permite:

- Agregar productos.
- Modificar cantidades.
- Eliminar productos individualmente.
- Vaciar completamente el carrito.

### 💳 Checkout con Stripe

El checkout está integrado con Stripe para procesar pagos de forma segura.

Permite ingresar:

- Datos de tarjeta.
- Dirección de envío.
- Información necesaria para completar la compra.

### ✅ Página de Confirmación

Ruta:

```text
/return
```

Muestra:

- Confirmación del pago.
- Resumen de la compra.
- Animación de celebración mediante `canvas-confetti`.

### 📋 Historial de Órdenes

Ruta:

```text
/orders
```

Permite al usuario autenticado:

- Consultar sus órdenes.
- Visualizar el historial de compras.
- Acceder al detalle de cada orden.

---

# 📊 2. Dashboard — Panel de Administración

Aplicación administrativa desplegada en **Vercel**.

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- Shadcn/ui
- TanStack Table v8
- TanStack Query v4
- Recharts
- Clerk
- React Hook Form
- Zod

## 🔐 Control de Acceso

El dashboard permite navegación pública para facilitar la demostración del proyecto.

Sin embargo, las operaciones administrativas están protegidas mediante **RBAC**.

Únicamente los usuarios con rol de **Administrador** en Clerk pueden:

- Crear productos.
- Editar productos.
- Eliminar productos.
- Gestionar categorías.
- Realizar operaciones administrativas.

## 📦 Módulos de Gestión

El dashboard cuenta con módulos independientes para:

- Usuarios.
- Productos.
- Órdenes.
- Categorías.

## 📊 Tablas Avanzadas

Las tablas utilizan **TanStack Table** e incluyen:

- Paginación.
- Ordenamiento.
- Selección múltiple.
- Borrado masivo.
- Búsqueda global.
- Filtros.

La búsqueda permite localizar información por:

- Nombre del producto.
- Email del usuario.

## 📝 Formularios

Los formularios utilizan:

- React Hook Form.
- Zod.
- TanStack Query.
- `useMutation`.

Las validaciones se realizan antes de enviar la información al backend.

---

# ⚙️ Microservicios Backend

| Servicio            | Framework / Stack         | Base de Datos | Responsabilidad                                             |
| ------------------- | ------------------------- | ------------- | ----------------------------------------------------------- |
| **product-service** | Express 5 + Prisma        | PostgreSQL    | Gestiona productos y categorías y publica eventos en Kafka. |
| **payment-service** | Hono + Stripe             | Stripe        | Sincroniza productos/precios y gestiona checkout y pagos.   |
| **order-service**   | Fastify + Node Cron       | MongoDB       | Gestiona y persiste las órdenes recibidas desde Kafka.      |
| **email-service**   | Node.js + Nodemailer      | —             | Envía emails transaccionales asociados a las órdenes.       |
| **auth-service**    | Express / Fastify + Clerk | —             | Gestiona autenticación y verificación de sesiones.          |
| **kafka-init**      | KafkaJS + Node.js         | —             | Inicializa los tópicos necesarios de Kafka.                 |

---

# 🔄 Arquitectura Event-Driven

La comunicación entre los microservicios se realiza mediante **Apache Kafka**.

Esto permite desacoplar los servicios y evitar una dependencia directa entre ellos.

```text
┌──────────────────┐
│ Product Service  │
└────────┬─────────┘
         │
         │ product.created
         │ product.updated
         ▼
┌──────────────────┐
│   Apache Kafka   │
└────────┬─────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Payment Service │  │  Order Service  │
└────────┬────────┘  └────────┬────────┘
         │                    │
         ▼                    ▼
      Stripe                MongoDB
                              │
                              ▼
                       ┌──────────────┐
                       │Email Service │
                       └──────┬───────┘
                              │
                              ▼
                         Nodemailer
```

---

# 1. 🔄 Sincronización de Productos y Precios

Cuando un administrador crea o modifica un producto:

```text
┌──────────────┐
│   Dashboard  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Product Service  │
└──────┬───────────┘
       │
       ├─────────────────────► PostgreSQL
       │
       │ Evento
       ▼
┌──────────────────┐
│   Apache Kafka   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Payment Service  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Stripe API     │
└──────────────────┘
```

## Flujo

1. El administrador crea o modifica un producto desde el dashboard.
2. `product-service` persiste la información en PostgreSQL.
3. `product-service` publica un evento en Kafka.
4. `payment-service` consume el evento.
5. `payment-service` registra o actualiza el producto y su precio en Stripe.

## 🔐 Beneficio de Seguridad

El precio utilizado durante el checkout se obtiene desde la información sincronizada con Stripe, evitando depender de un precio enviado directamente desde el cliente frontend.

Esto ayuda a impedir que un atacante pueda modificar arbitrariamente el monto de una compra desde el navegador.

---

# 2. 💳 Flujo de Compra y Procesamiento de Órdenes

El flujo de una compra se realiza de la siguiente manera:

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Stripe Checkout  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Payment Service  │
└──────┬───────────┘
       │
       │ payment.succeeded
       ▼
┌──────────────────┐
│   Apache Kafka   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Order Service   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│     MongoDB      │
└──────────────────┘

         │
         │ order.created
         ▼
┌──────────────────┐
│   Apache Kafka   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Email Service   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Nodemailer    │
└──────────────────┘
```

## Flujo

1. El usuario inicia el checkout desde `client`.
2. Stripe procesa el pago.
3. `payment-service` recibe la confirmación del pago.
4. `payment-service` publica el evento correspondiente en Kafka.
5. `order-service` consume el evento.
6. `order-service` crea la orden.
7. La orden se almacena en MongoDB.
8. `order-service` publica el evento correspondiente.
9. `email-service` consume el evento.
10. Se envía un email de confirmación mediante Nodemailer.

---

# 📦 Paquetes Compartidos

Los paquetes internos se encuentran dentro de `packages/` y son utilizados por diferentes aplicaciones del monorepo.

## `@repo/types`

Definiciones TypeScript centralizadas y esquemas Zod compartidos para:

- Auth.
- Product.
- Cart.
- Order.
- Payment.

## `@repo/productdb`

Capa de abstracción para PostgreSQL utilizando:

- Prisma ORM.
- PostgreSQL.
- `@prisma/adapter-pg`.

## `@repo/orderdb`

Contiene los schemas y modelos de Mongoose utilizados para gestionar las órdenes almacenadas en MongoDB.

## `@repo/kafka`

Abstracción reusable basada en **KafkaJS** para:

- Publicar eventos.
- Consumir eventos.
- Crear productores.
- Crear consumidores.
- Centralizar la configuración de Kafka.

---

# 🧪 Testing y Calidad de Código

El proyecto incorpora testing automatizado para controlar la calidad de los servicios backend.

## Pruebas Unitarias e Integración

Se utilizan:

- **Vitest**
- **Supertest**

Los tests cubren controladores y lógica de negocio de los servicios backend.

## 🔎 Verificación de Tipos

El proyecto utiliza TypeScript con configuración estricta y comandos de verificación de tipos mediante `check-types`.

## 🧹 ESLint

Existe una configuración compartida de ESLint dentro de:

```text
packages/eslint-config
```

Esto permite mantener reglas consistentes en todo el monorepo.

---

# 🏗️ Infraestructura

## Frontend

```text
                    VERCEL
                      │
              ┌───────┴───────┐
              │               │
              ▼               ▼
          ┌───────┐       ┌───────────┐
          │ Client│       │ Dashboard │
          └───────┘       └───────────┘
```

## Backend

```text
                    ORACLE CLOUD
                         │
       ┌─────────────────┼─────────────────┐
       │        │        │        │        │
       ▼        ▼        ▼        ▼        ▼
    Product  Payment   Order    Email     Auth
    Service  Service   Service  Service  Service
```

## Message Broker

```text
                    AIVEN CLOUD
                         │
                         ▼
                 ┌──────────────┐
                 │ Apache Kafka │
                 └──────────────┘
```

## Databases & External Services

```text
┌────────────┐
│ PostgreSQL │
└────────────┘

┌────────────┐
│  MongoDB   │
└────────────┘

┌────────────┐
│   Stripe   │
└────────────┘

┌────────────┐
│   Clerk    │
└────────────┘
```

---

# 🔗 Flujo General del Sistema

```text
                              ┌───────────────┐
                              │    Client     │
                              │   React 19    │
                              └───────┬───────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │    Product    │
                              │    Service    │
                              └───────┬───────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
                  ┌─────────────┐          ┌──────────────┐
                  │ PostgreSQL  │          │ Apache Kafka │
                  └─────────────┘          └───────┬──────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              │                    │                    │
                              ▼                    ▼                    ▼
                       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                       │   Payment   │      │    Order    │      │    Email    │
                       │   Service   │      │   Service   │      │   Service   │
                       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
                              │                    │                    │
                              ▼                    ▼                    ▼
                         ┌─────────┐          ┌─────────┐          ┌───────────┐
                         │ Stripe  │          │ MongoDB │          │ Nodemailer│
                         └─────────┘          └─────────┘          └───────────┘
```

---

# 🔐 Seguridad

La arquitectura incorpora diferentes mecanismos para proteger las operaciones críticas.

### Autenticación

**Clerk** gestiona:

- Registro de usuarios.
- Inicio de sesión.
- Sesiones.
- Tokens.
- Identidad del usuario.

### Autorización

El dashboard utiliza **RBAC (Role-Based Access Control)**.

```text
                    ┌─────────────┐
                    │    Clerk    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
                 Customer       Admin
                    │             │
                    │             ├──► Create
                    │             ├──► Update
                    │             ├──► Delete
                    │             └──► Manage
                    │
                    └──► Shopping
```

### Protección de precios

Los precios utilizados para los pagos son sincronizados entre `product-service` y Stripe mediante Kafka.

Esto evita confiar en valores enviados directamente desde el navegador del cliente.

---

# 📈 Ventajas de la Arquitectura

## Desacoplamiento

Los servicios no dependen directamente unos de otros para comunicarse.

```text
Product Service
       │
       ▼
     Kafka
   ┌───┼────┐
   ▼   ▼    ▼
Payment Order Email
```

## Escalabilidad

Cada microservicio puede escalarse independientemente según su carga.

Por ejemplo:

```text
Payment Service
       │
       ├── Instance 1
       ├── Instance 2
       ├── Instance 3
       └── Instance 4
```

## Persistencia especializada

Cada servicio utiliza la tecnología de almacenamiento más adecuada para su responsabilidad.

```text
Products
   │
   ▼
PostgreSQL + Prisma

Orders
   │
   ▼
MongoDB + Mongoose

Payments
   │
   ▼
Stripe
```

## Comunicación asíncrona

Kafka permite que los servicios reaccionen a eventos sin establecer una comunicación directa entre ellos.

---

# 📌 Resumen

Este proyecto implementa un e-commerce moderno utilizando una arquitectura de microservicios y comunicación orientada a eventos.

Las principales características son:

- 🧩 **Monorepo** con Turborepo y pnpm Workspaces.
- ⚛️ **React 19** para las aplicaciones frontend.
- 🚀 **Vite** como herramienta de desarrollo y build.
- 🔐 **Clerk** para autenticación y RBAC.
- 💳 **Stripe** para procesamiento de pagos.
- 📨 **Apache Kafka** para comunicación orientada a eventos.
- 🟢 **Express, Hono y Fastify** para los microservicios.
- 🐘 **PostgreSQL + Prisma** para productos.
- 🍃 **MongoDB + Mongoose** para órdenes.
- 📧 **Nodemailer** para emails transaccionales.
- 🐳 **Docker** para infraestructura local.
- ☁️ **Vercel** para frontend.
- ☁️ **Oracle Cloud** para backend.
- ☁️ **Aiven Cloud** para Kafka.
- 🧪 **Vitest + Supertest** para testing.
- 📦 **Turborepo + pnpm Workspaces** para gestionar el monorepo.

---

# 🏁 Conclusión

El proyecto combina **microservicios, Event-Driven Architecture, Apache Kafka, múltiples bases de datos, Stripe, autenticación, RBAC y un monorepo TypeScript** para construir una plataforma e-commerce preparada para crecer de forma independiente y escalable.

La separación de responsabilidades permite evolucionar cada componente sin afectar directamente al resto del sistema, mientras que Kafka proporciona una capa de comunicación asíncrona que desacopla los servicios y facilita la incorporación de nuevas funcionalidades en el futuro.
