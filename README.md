# F1 Dashboard - Live Race Simulation

Dashboard de Fórmula 1 con simulación de carreras en tiempo real.

## Arquitectura

```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐     Query      ┌─────────────────┐
│    FRONTEND     │◄─────────────────►│     BACKEND     │◄──────────────►│     SQLite      │
│  React + Vite   │                   │ Express+Socket  │                │     (f1.db)     │
└────────┬────────┘                   └────────┬────────┘                └─────────────────┘
         │                                     │
         │      WebSocket (Socket.IO)          │
         │◄───────────────────────────────────►│
         │                                     │
         │                              ┌──────┴──────┐
         └───── race:update ◄──────────│ RACE ENGINE │
                events                 │   (100ms)   │
                                       └─────────────┘
```

## Stack Tecnológico

### Backend
- Node.js + Express
- Socket.IO (WebSocket)
- SQLite (better-sqlite3)

### Frontend
- React 18 + Vite
- TailwindCSS
- Recharts (gráficos)
- Socket.IO Client

## Instalación

```bash
# Clonar el repositorio
git clone <url>
cd f1-dashboard

# Instalar dependencias del backend
cd backend
npm install

# Inicializar base de datos
npm run db:init
npm run db:seed

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Ejecución

### Desarrollo

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Acceder a: http://localhost:5173

### Producción

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/drivers` | GET | Lista todos los pilotos |
| `/api/teams` | GET | Lista todos los equipos |
| `/api/tracks` | GET | Lista todos los circuitos |
| `/api/race/state` | GET | Estado actual de la carrera |
| `/api/race/start` | POST | Iniciar carrera |
| `/api/race/pause` | POST | Pausar carrera |
| `/api/race/resume` | POST | Reanudar carrera |
| `/api/race/stop` | POST | Detener carrera |
| `/api/race/reset` | POST | Reiniciar carrera |

## WebSocket Events

### Cliente → Servidor
- `race:start` - Iniciar carrera
- `race:pause` - Pausar
- `race:resume` - Reanudar
- `race:stop` - Detener
- `race:reset` - Reiniciar
- `race:speed` - Cambiar velocidad (0.5x - 4x)
- `race:weather` - Cambiar clima (dry/wet/mixed)
- `telemetry:select` - Suscribirse a telemetría de piloto

### Servidor → Cliente
- `race:state` - Estado inicial
- `race:update` - Actualización de carrera (cada 100ms)
- `race:lap_completed` - Vuelta completada
- `race:overtake` - Adelantamiento
- `race:pit_stop` - Parada en boxes
- `race:finished` - Carrera terminada
- `telemetry:update` - Telemetría detallada

## Características

- Simulación de carrera en tiempo real
- 20 pilotos de F1 2024
- 23 circuitos reales
- Telemetría detallada (velocidad, RPM, DRS, etc.)
- Control de clima dinámico
- Paradas en boxes automáticas
- Desgaste de neumáticos
- Gráficos de estadísticas en vivo

## Estructura del Proyecto

```
f1-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Controladores API
│   │   ├── routes/         # Rutas Express
│   │   ├── models/         # Modelos de datos
│   │   ├── database/       # SQLite config
│   │   ├── simulation/     # Motor de carrera
│   │   └── websocket/      # Socket.IO handlers
│   └── data/
│       └── f1.db           # Base de datos SQLite
│
├── frontend/
│   └── src/
│       ├── components/     # Componentes React
│       ├── pages/          # Páginas
│       ├── hooks/          # Custom hooks
│       └── services/       # API client
│
└── README.md
```

## Licencia

MIT
