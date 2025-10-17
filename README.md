# Eskayser Frontend - Sistema de Gestión de Fraccionamientos

Aplicación web frontend desarrollada en React para la gestión integral de fraccionamientos residenciales, control de acceso de visitantes y administración de casas y residentes.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Prerequisitos](#prerequisitos)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
- [Sistema de Rutas](#sistema-de-rutas)
- [Componentes Principales](#componentes-principales)
- [Flujos de Usuario](#flujos-de-usuario)
- [Integración con Backend](#integración-con-backend)
- [Guía de Contribución](#guía-de-contribución)
- [Diagramas](#diagramas)
- [Despliegue](#despliegue)
- [Troubleshooting](#troubleshooting)

## Descripción General

Frontend web responsive que proporciona:

- **Portal de Administración**: Dashboard para superadmins y admins de fraccionamiento
- **Gestión de Casas y Residentes**: CRUD completo con interfaz intuitiva
- **Sistema de Visitantes**: Formulario público para registro de visitas con captura de foto
- **Generación de QR**: Códigos QR para acceso de residentes y visitantes
- **Reportes en Tiempo Real**: Visualización de solicitudes de acceso con paginación
- **Interfaz Material Design**: UI moderna y responsive con Material-UI
- **Búsqueda y Filtrado**: Funcionalidad avanzada de búsqueda en tiempo real

## Características Principales

### Gestión de Fraccionamientos
- Ver listado completo de fraccionamientos
- Crear nuevos complejos residenciales
- Activar/desactivar fraccionamientos
- Generar y visualizar códigos QR

### Gestión de Casas y Residentes
- Vista grid y lista intercambiable
- Agregar/editar/eliminar casas
- Gestionar múltiples residentes por casa
- Activar/desactivar casas y residentes
- Generación de QR individual por casa

### Sistema de Visitantes
- Formulario público de registro
- Captura de foto con validación
- Envío automático de notificación push
- Validaciones en tiempo real

### Reportes y Análisis
- Visualización de solicitudes de acceso
- Filtrado por fecha y estado
- Paginación de resultados (20 por página)
- Información detallada de cada visita

## Tecnologías

### Core
- **React** 18.3.1 - Librería UI con hooks modernos
- **React DOM** 18.3.1 - Rendering para web
- **React Router DOM** 6.30.1 - Enrutamiento SPA

### UI y Estilos
- **Material-UI (MUI)** 6.4.0 - Sistema de diseño completo
  - `@mui/material` - Componentes base
  - `@mui/icons-material` - Biblioteca de iconos
  - `@mui/x-data-grid` - Tablas de datos avanzadas
  - `@mui/x-data-grid-premium` - Funcionalidad premium para tablas
- **@emotion/react** 11.14.0 - CSS-in-JS
- **@emotion/styled** 11.14.0 - Componentes estilizados

### Comunicación HTTP
- **axios** 1.7.9 - Cliente HTTP para peticiones al backend

### Generación de QR
- **qrcode** 1.5.4 - Librería base para QR
- **qrcode.react** 4.2.0 - Componente React para QR

### Monitoreo
- **@vercel/speed-insights** 1.1.0 - Métricas de rendimiento

### Testing
- **@testing-library/react** 11.2.7 - Testing de componentes
- **@testing-library/jest-dom** 5.17.0 - Matchers personalizados Jest
- **@testing-library/user-event** 12.8.3 - Simulación de eventos de usuario

### Build Tools
- **react-scripts** 5.0.1 - Scripts de Create React App (Webpack, Babel, etc.)
- **web-vitals** 1.1.2 - Métricas de rendimiento web

### DevDependencies
- **@babel/plugin-proposal-private-property-in-object** 7.21.11 - Plugin Babel

## Estructura del Proyecto

```
Ingresos/
├── public/                          # Archivos estáticos
│   ├── favicon.ico
│   ├── index.html                   # HTML principal
│   └── manifest.json                # PWA manifest
│
├── src/                             # Código fuente
│   ├── App.js                       # Componente raíz con Router
│   ├── App.test.js                  # Tests
│   ├── index.js                     # Punto de entrada
│   ├── index.css                    # Estilos globales
│   ├── reportWebVitals.js           # Métricas de rendimiento
│   │
│   └── assets/                      # Recursos de la aplicación
│       │
│       ├── pages/                   # Páginas/Vistas principales
│       │   ├── Login.jsx            # Autenticación (350 líneas)
│       │   ├── Dashboard.jsx        # Dashboard principal (450 líneas)
│       │   ├── EskayserAdmin.jsx    # Panel de superadmin
│       │   ├── ReportesAdmin.jsx    # Reportes de visitas (394 líneas)
│       │   ├── Invitados.jsx        # Formulario visitantes (300 líneas)
│       │   ├── LoginTables.jsx      # Gestión de tablas
│       │   ├── Formulario.jsx       # Formulario genérico
│       │   ├── Fracc.jsx            # Datos de fraccionamiento
│       │   └── AvisoPrivacidad.jsx  # Política de privacidad
│       │
│       ├── commponents/             # Componentes reutilizables
│       │   │
│       │   ├── Navbar.jsx           # Barra de navegación
│       │   ├── AdminTable.jsx       # Tabla administrativa
│       │   ├── EskayserAdminTable.jsx
│       │   ├── TextField.jsx        # Campo de texto custom
│       │   ├── selecter.jsx         # Selector custom
│       │   ├── subButton.jsx        # Botón custom
│       │   │
│       │   ├── shared/              # Componentes compartidos
│       │   │   ├── AdminHeader.jsx  # Encabezado con estadísticas
│       │   │   ├── HouseCard.jsx    # Tarjeta de casa expandible
│       │   │   ├── DataTable.jsx    # Tabla de datos flexible
│       │   │   ├── DashboardStats.jsx  # Tarjetas estadísticas
│       │   │   ├── StatusChip.jsx   # Chip de estado
│       │   │   ├── SearchAndActions.jsx  # Barra de búsqueda
│       │   │   ├── LoadingState.jsx # Estados de carga
│       │   │   ├── EmptyState.jsx   # Estados vacíos
│       │   │   └── ResidentesInactivos.jsx
│       │   │
│       │   ├── modals/              # Componentes Modal
│       │   │   ├── QRModal.jsx      # Mostrar QR
│       │   │   ├── ResidentFormModal.jsx  # Agregar residente
│       │   │   ├── EditResidentModal.jsx  # Editar residente
│       │   │   ├── AddHouseModal.jsx      # Agregar casa
│       │   │   └── ToggleFraccionamientoModal.jsx
│       │   │
│       │   ├── ResidenceTable/      # Tabla especializada
│       │   │   ├── ResidenceTable.jsx
│       │   │   ├── components/
│       │   │   │   ├── ResidenceTableView.jsx
│       │   │   │   ├── ResidentsDetails.jsx
│       │   │   │   ├── TableHeader.jsx
│       │   │   │   ├── AddResidentDialog.jsx
│       │   │   │   ├── ResidenceRow.jsx
│       │   │   │   └── EmptyState.jsx
│       │   │   └── hooks/
│       │   │       └── useResidences.js  # Hook personalizado
│       │   │
│       │   ├── handlers/            # Manejadores de eventos
│       │   │   └── handleFotoChange.jsx
│       │   │
│       │   ├── EskayserAdmin/       # Componentes admin
│       │   ├── AgregarFracionamientoModal.jsx
│       │   ├── ModificarFraccionamientoModal.jsx
│       │   └── ContactoModal.jsx
│       │
│       ├── img/                     # Imágenes y assets
│       │   ├── Eskayser.png         # Logo principal
│       │   └── logo.jpg
│       │
│       └── utils/                   # Funciones utilidad
│           └── generateQR.jsx       # Generador de QR
│
├── build/                           # Build de producción
├── node_modules/                    # Dependencias (951 paquetes)
├── .env                             # Variables de entorno
├── .gitignore                       # Archivos ignorados
├── vercel.json                      # Configuración Vercel
├── package.json                     # Dependencias y scripts
├── package-lock.json                # Lock de dependencias
└── README.md                        # Documentación
```

## Prerequisitos

- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **Backend API**: Servidor backend corriendo (ver IngresosBackend)

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd Ingresos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz:

```env
REACT_APP_API_URL_PROD=http://localhost:5002
```

### 4. Iniciar servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Variables de Entorno

```env
# URL del Backend API
REACT_APP_API_URL_PROD=http://localhost:5002

# En producción:
REACT_APP_API_URL_PROD=https://tu-backend-api.vercel.app
```

**IMPORTANTE**: No commitear el archivo `.env` al repositorio.

## Scripts Disponibles

### `npm start`
Inicia el servidor de desarrollo en `http://localhost:3000`
- Hot Module Replacement (HMR) automático
- React Fast Refresh
- Visualización de errores en el navegador

### `npm run build`
Genera build de producción en carpeta `build/`
- Minificación de JS y CSS
- Optimización de assets
- Tree-shaking
- Source maps

### `npm test`
Ejecuta tests en modo watch interactivo

### `npm run eject`
**IRREVERSIBLE**: Expone toda la configuración de CRA
- Solo usar si necesitas personalización avanzada
- No recomendado para la mayoría de proyectos

## Arquitectura de la Aplicación

### Patrón de Diseño

La aplicación sigue el patrón **Container/Presentational Components**:

```
Páginas (Container Components)
├── Manejan estado y lógica de negocio
├── Realizan llamadas API
└── Pasan datos a componentes presentacionales

Componentes Compartidos (Presentational Components)
├── Reciben props
├── Renderizan UI
└── Emiten eventos hacia arriba
```

### Flujo de Datos

```
Usuario → Evento → Componente → Handler → API Call → Backend
                                                         ↓
Usuario ← UI Update ← setState ← Response ← Backend ←───┘
```

### Gestión de Estado

- **React useState**: Estado local de componentes
- **localStorage**: Persistencia de autenticación
  - `token`: JWT token del usuario
  - `user`: Datos del usuario logueado
  - `role`: Rol del usuario (admin/superadmin)

### Comunicación HTTP

```javascript
// Configuración base de axios
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL_PROD;

// Headers de autenticación
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Ejemplo de petición
const fetchData = async () => {
  const response = await axios.get(
    `${API_URL}/api/fraccionamientos/${id}`,
    getAuthHeaders()
  );
  return response.data;
};
```

## Sistema de Rutas

### Configuración de Router

```javascript
// App.js
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard/:id" element={<Dashboard />} />
    <Route path="/reportes/:id" element={<ReportesAdmin />} />
    <Route path="/admin" element={<EskayserAdmin />} />
    <Route path="/Visitas" element={<Invitados />} />
    <Route path="/AvisoPrivacidad" element={<AvisoPrivacidad />} />
  </Routes>
</BrowserRouter>
```

### Rutas y Permisos

| Ruta | Componente | Rol | Descripción |
|------|-----------|-----|-------------|
| `/` | Login | Público | Página de autenticación |
| `/admin` | EskayserAdmin | Superadmin | Panel de superadministrador |
| `/dashboard/:id` | Dashboard | Admin/Superadmin | Dashboard de fraccionamiento |
| `/reportes/:id` | ReportesAdmin | Admin/Superadmin | Reportes de visitas |
| `/Visitas?id=&casa=` | Invitados | Público | Formulario de visitantes |
| `/AvisoPrivacidad` | AvisoPrivacidad | Público | Política de privacidad |

### Protección de Rutas

```javascript
// Verificación de autenticación
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/');
  }
}, [navigate]);
```

## Componentes Principales

### Login.jsx
**Propósito**: Autenticación de usuarios

**Características:**
- Login dual (superadmin/admin de fraccionamiento)
- Validación de credenciales
- Almacenamiento de token en localStorage
- Redirección según rol

**Estados:**
```javascript
const [formData, setFormData] = useState({
  usuario: '',
  contrasena: ''
});
const [error, setError] = useState('');
```

**Flujo:**
```
1. Usuario ingresa credenciales
2. POST /api/fraccionamientos/login
3. Backend valida y retorna token + role
4. Frontend guarda en localStorage
5. Redirección:
   - Superadmin → /admin
   - Admin → /dashboard/{fraccId}
```

### Dashboard.jsx
**Propósito**: Gestión principal de casas y residentes

**Características:**
- Vista grid/lista intercambiable
- Búsqueda en tiempo real
- Filtrado por estado (activo/bloqueado)
- CRUD completo de casas y residentes
- Generación de QR por casa

**Estados principales:**
```javascript
const [data, setData] = useState([]);              // Todas las casas
const [filteredData, setFilteredData] = useState([]); // Casas filtradas
const [searchValue, setSearchValue] = useState('');
const [statusFilter, setStatusFilter] = useState('');
const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
const [loading, setLoading] = useState(true);
```

**Modales:**
- `ResidentFormModal` - Agregar residente
- `EditResidentModal` - Editar residente
- `AddHouseModal` - Agregar casa
- `QRModal` - Mostrar QR de casa

**Acciones principales:**
```javascript
// Fetch inicial
const fetchData = async () => {
  const response = await axios.get(`${API_URL}/api/fraccionamientos/${id}`);
  setData(response.data.residencias);
};

// Agregar residente
const handleAddResidente = async (residenteData) => {
  await axios.post(
    `${API_URL}/api/fraccionamientos/${id}/casas/${numeroCasa}/residentes`,
    residenteData
  );
  fetchData();
};

// Toggle casa activa
const toggleCasaActiva = async (numeroCasa) => {
  await axios.put(
    `${API_URL}/api/fraccionamientos/${id}/casas/${numeroCasa}/toggle`
  );
  fetchData();
};
```

### EskayserAdmin.jsx
**Propósito**: Panel de superadministrador

**Características:**
- Listado de todos los fraccionamientos
- Crear nuevo fraccionamiento
- Activar/desactivar fraccionamientos
- Ver QR de fraccionamiento
- Estadísticas globales

**Operaciones:**
- `GET /api/fraccionamientos` - Listar todos
- `POST /api/fraccionamientos` - Crear nuevo
- `PUT /api/fraccionamientos/:id/toggle` - Toggle estado

### ReportesAdmin.jsx
**Propósito**: Visualización de reportes de visitas

**Características:**
- Tabla paginada (20 por página)
- Información detallada de cada visita
- Foto del visitante
- Filtrado por fecha
- Exportación de datos

**Estructura de datos:**
```javascript
{
  nombre: "Juan Pérez",
  motivo: "Entrega de paquete",
  foto: "https://cloudinary.com/...",
  tiempo: "2025-01-15T10:30:00Z",
  numeroCasa: "15",
  estatus: "aceptado"
}
```

### Invitados.jsx
**Propósito**: Formulario público de registro de visitantes

**Características:**
- Captura de foto obligatoria
- Validación en tiempo real
- Envío automático de notificación push
- Feedback visual del estado

**Validaciones:**
```javascript
// Nombre: 3-30 caracteres
const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,30}$/;

// Motivo: 3-40 caracteres
const motivoRegex = /^.{3,40}$/;

// Foto: JPG o PNG, máx 5MB
const fotoValidation = file.type.match(/image\/(jpeg|jpg|png)/);
```

**Flujo:**
```
1. Visitante escanea QR de casa
2. URL: /Visitas?id={fraccId}&casa={numero}
3. Rellena formulario + captura foto
4. POST /api/fraccionamientos/{fraccId}/casas/{numero}/visitas
5. Backend sube foto a Cloudinary
6. Envía notificación push a residentes
7. Residente acepta/rechaza desde app móvil
```

### Componentes Compartidos

#### HouseCard.jsx
Tarjeta expandible que muestra información de casa

**Props:**
```javascript
{
  numero: String,
  activa: Boolean,
  residentes: Array,
  onToggle: Function,
  onAddResident: Function,
  onEditResident: Function,
  onDeleteResident: Function,
  onShowQR: Function
}
```

#### DataTable.jsx
Tabla genérica con acciones

**Features:**
- Ordenamiento por columnas
- Acciones por fila
- Responsive
- Paginación

#### StatusChip.jsx
Badge de estado visual

```javascript
<StatusChip
  status="activo"  // "activo" | "bloqueado"
  label="Activo"
/>
```

## Flujos de Usuario

### Flujo de Login

```
┌──────────┐
│ Usuario  │ Ingresa credenciales
└─────┬────┘
      │
      ▼
┌─────────────┐
│   Login.jsx │ Valida formato
└──────┬──────┘
       │ POST /api/fraccionamientos/login
       ▼
┌──────────────┐
│   Backend    │ Valida credenciales
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Response   │ {token, role, redirect, fraccId}
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ localStorage │ Guarda token, user, role
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Redirección │
└──────────────┘
       │
       ├── Superadmin → /admin
       └── Admin → /dashboard/{fraccId}
```

### Flujo de Gestión de Casas

```
┌──────────────┐
│ Dashboard    │ Vista inicial
└──────┬───────┘
       │
       ├──→ Búsqueda en tiempo real
       │    └─→ Filtra array local
       │
       ├──→ Agregar Casa
       │    ├─→ Abre AddHouseModal
       │    ├─→ POST /casas
       │    └─→ Refresca datos
       │
       ├──→ Toggle Casa
       │    ├─→ PUT /casas/:numero/toggle
       │    └─→ Refresca datos
       │
       └──→ Ver QR
            ├─→ Abre QRModal
            └─→ Muestra QR generado
```

### Flujo de Visitantes

```
┌──────────────┐
│  Visitante   │ Escanea QR de casa
└──────┬───────┘
       │ URL: /Visitas?id={fraccId}&casa={numero}
       ▼
┌──────────────┐
│Invitados.jsx │ Formulario
└──────┬───────┘
       │ Rellena datos + foto
       ▼
┌──────────────┐
│  Validación  │ Valida campos
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   FormData   │ Prepara multipart/form-data
└──────┬───────┘
       │ POST /api/fraccionamientos/{fraccId}/casas/{numero}/visitas
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       ├──→ Multer guarda foto temporal
       ├──→ Upload a Cloudinary
       ├──→ Crea Reporte en DB
       └──→ Envía push notification (OneSignal)
              │
              ▼
       ┌──────────────┐
       │  Residentes  │ Reciben notificación
       └──────┬───────┘
              │
              ├──→ Acepta → Abre puerta
              └──→ Rechaza → Notifica
```

## Integración con Backend

### Endpoints Utilizados

#### Autenticación
```javascript
// Login
POST /api/fraccionamientos/login
Body: { usuario, contrasena }
Response: { token, role, redirect, fraccId }
```

#### Fraccionamientos
```javascript
// Listar todos (superadmin)
GET /api/fraccionamientos
Headers: { Authorization: Bearer {token} }

// Obtener uno
GET /api/fraccionamientos/:fraccId

// Crear
POST /api/fraccionamientos
Body: { nombre, direccion, usuario, correo, contrasena, telefono }

// Toggle activo
PUT /api/fraccionamientos/:fraccId/toggle
```

#### Casas
```javascript
// Crear casa
POST /api/fraccionamientos/:fraccId/casas
Body: { numero }

// Toggle activo
PUT /api/fraccionamientos/:fraccId/casas/:numero/toggle
```

#### Residentes
```javascript
// Agregar residente
POST /api/fraccionamientos/:fraccId/casas/:numero/residentes
Body: { nombre, activo }

// Editar residente
PUT /api/fraccionamientos/:fraccId/casas/:numero/residentes/:residenteId
Body: { nombre }

// Toggle activo
PUT /api/fraccionamientos/:fraccId/casas/:numero/residentes/:residenteId/toggle

// Eliminar
DELETE /api/fraccionamientos/:fraccId/casas/:numero/residentes/:residenteId
```

#### Visitas
```javascript
// Registrar visita
POST /api/fraccionamientos/:fraccId/casas/:numero/visitas
Headers: { Content-Type: multipart/form-data }
Body: FormData {
  nombre: string,
  motivo: string,
  residencia: string,
  FotoVisita: File,
  origen: "web"
}
```

#### Reportes
```javascript
// Obtener reportes
GET /api/reportes/:fraccId
```

## Guía de Contribución

### Flujo de Trabajo

#### 1. Fork y clonar

```bash
git clone <repository-url>
cd Ingresos
npm install
```

#### 2. Crear rama para feature

```bash
git checkout -b feature/nueva-funcionalidad
```

#### 3. Desarrollo

```bash
npm start  # Servidor de desarrollo
```

#### 4. Commit y push

```bash
git add .
git commit -m "feat: descripción del cambio"
git push origin feature/nueva-funcionalidad
```

#### 5. Pull Request

Crear PR en GitHub con descripción detallada

### Convenciones de Código

#### Nomenclatura

**Componentes:**
```javascript
// PascalCase para componentes
export const HouseCard = ({ numero, activa }) => { ... };
```

**Funciones:**
```javascript
// camelCase para funciones
const fetchData = async () => { ... };
const handleAddResidente = (data) => { ... };
```

**Constantes:**
```javascript
// UPPER_SNAKE_CASE
const API_URL = process.env.REACT_APP_API_URL_PROD;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
```

#### Estructura de Componente

```javascript
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';

export const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks de estado
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 2. useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Funciones handlers
  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = () => {
    // lógica
  };

  // 4. Render
  return (
    <Box>
      {/* JSX */}
    </Box>
  );
};
```

#### Commits Semánticos

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `refactor:` Refactorización de código
- `style:` Cambios de estilos
- `docs:` Documentación
- `test:` Tests
- `chore:` Tareas de mantenimiento

### Testing

```bash
# Ejecutar tests
npm test

# Coverage
npm test -- --coverage
```

**Estructura de test:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { HouseCard } from './HouseCard';

describe('HouseCard', () => {
  it('renders house number', () => {
    render(<HouseCard numero="15" activa={true} residentes={[]} />);
    expect(screen.getByText('Casa 15')).toBeInTheDocument();
  });

  it('calls onToggle when button clicked', () => {
    const mockToggle = jest.fn();
    render(<HouseCard numero="15" activa={true} onToggle={mockToggle} />);

    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
```

## Diagramas

### Arquitectura de Componentes

```
App.js (Router)
├── Login
│   └── TextField
│
├── EskayserAdmin (Superadmin)
│   ├── AdminHeader
│   ├── SearchAndActions
│   ├── AdminTable
│   ├── AgregarFraccionamientoModal
│   ├── ModificarFraccionamientoModal
│   └── QRModal
│
├── Dashboard (Admin)
│   ├── Navbar
│   ├── DashboardStats
│   ├── SearchAndActions
│   ├── HouseCard (modo grid)
│   │   ├── StatusChip
│   │   └── Botones de acción
│   ├── DataTable (modo lista)
│   ├── ResidentFormModal
│   ├── EditResidentModal
│   ├── AddHouseModal
│   └── QRModal
│
├── ReportesAdmin
│   ├── Navbar
│   ├── DataTable
│   └── Paginación
│
├── Invitados (Público)
│   ├── TextField
│   ├── selecter
│   └── subButton
│
└── AvisoPrivacidad
```

### Flujo de Estado en Dashboard

```
Initial Load
    ↓
fetchData()
    ↓
GET /api/fraccionamientos/:id
    ↓
setData(residencias)
    ↓
setFilteredData(residencias)
    ↓
Render UI
    ↓
┌───────────────────┐
│  User Interaction │
└─────────┬─────────┘
          │
    ┌─────┴─────┬─────────┬──────────┐
    ▼           ▼         ▼          ▼
 Búsqueda   Filtro   Agregar    Toggle
    │           │         │          │
    ▼           ▼         ▼          ▼
setSearch  setFilter   API Call   API Call
    │           │         │          │
    ▼           ▼         ▼          ▼
 Filter      Filter   fetchData  fetchData
  Local       Local       │          │
    │           │         ▼          ▼
    └───────────┴───→ Update UI ←───┘
```

## Despliegue

### Vercel (Recomendado)

#### Configuración `vercel.json`

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "https://ingresos-lime.vercel.app" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" }
      ]
    }
  ]
}
```

#### Pasos de despliegue

**1. Instalar Vercel CLI**
```bash
npm i -g vercel
```

**2. Build local (opcional)**
```bash
npm run build
```

**3. Deploy**
```bash
vercel
```

**4. Configurar variables de entorno**
En Vercel Dashboard → Project → Settings → Environment Variables:
```
REACT_APP_API_URL_PROD=https://tu-backend.vercel.app
```

**5. Deploy a producción**
```bash
vercel --prod
```

### Netlify

```bash
# Instalar CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### GitHub Pages

```bash
# Agregar en package.json
"homepage": "https://tu-usuario.github.io/Ingresos"

# Instalar gh-pages
npm install --save-dev gh-pages

# Agregar scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### Servidor Propio (Nginx)

```bash
# Build
npm run build

# Copiar a servidor
scp -r build/* user@server:/var/www/html/

# Configurar Nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Troubleshooting

### Error: "Cannot connect to backend"

**Solución:**
- Verificar que backend esté corriendo
- Comprobar REACT_APP_API_URL_PROD en `.env`
- Revisar CORS en backend
- Verificar network tab en DevTools

### Error: "Token inválido o expirado"

**Solución:**
```javascript
// Limpiar localStorage y volver a login
localStorage.clear();
window.location.href = '/';
```

### Error: "Failed to load resource: net::ERR_CONNECTION_REFUSED"

**Solución:**
- Verificar que backend esté en el puerto correcto
- Comprobar URL en axios calls
- Revisar firewall/antivirus

### Problema: Foto no se sube

**Solución:**
- Verificar formato (JPG/PNG)
- Comprobar tamaño (max 5MB)
- Revisar headers `Content-Type: multipart/form-data`
- Verificar configuración Cloudinary en backend

### Problema: QR no se genera

**Solución:**
```javascript
// Verificar que qrcode.react esté instalado
npm install qrcode.react

// Verificar formato de datos
const qrData = `${fraccId}|${residencia}|${residenteId}`;
```

### Build falla en producción

**Solución:**
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install

# Verificar warnings
npm run build

# Si hay errores ESLint, temporalmente:
# Crear .env.production
DISABLE_ESLINT_PLUGIN=true
```

## Performance y Optimización

### Code Splitting

```javascript
// Lazy loading de componentes
import React, { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./assets/pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Dashboard />
    </Suspense>
  );
}
```

### Memoización

```javascript
import { useMemo, useCallback } from 'react';

// Memoizar cálculos pesados
const filteredHouses = useMemo(() => {
  return data.filter(house =>
    house.numero.includes(searchValue)
  );
}, [data, searchValue]);

// Memoizar callbacks
const handleDelete = useCallback((id) => {
  // lógica
}, []);
```

### Optimización de Imágenes

```javascript
// Lazy loading de imágenes
<img
  src={foto}
  alt="Visitante"
  loading="lazy"
  style={{ maxWidth: '300px' }}
/>
```

## Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

## Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado por**: Eskayser Team
**URL de Producción**: https://ingresos-lime.vercel.app
**Última actualización**: 2025
