# 🏎️ Proyecto: Dashboard de Fórmula 1

## 📘 Descripción general

Aplicación web que simula un **dashboard de Fórmula 1**, mostrando:
- Mapa de pista con ubicación de pilotos.
- Telemetría y estadísticas en tiempo real.
- Paneles de control de carrera y simulación.
- Integración con un motor de simulación (Race Engine).

La aplicación está dividida en tres capas:
1. **Presentación (Frontend / UI)**
2. **Lógica y API Gateway (Backend)**
3. **Simulación y Datos**

---

## 🗺️ Diagrama de arquitectura

![Arquitectura del Dashboard F1](./A_flowchart_diagram_illustrates_a_Formula_1_racing.png)

---

## 🧩 1. Capa de Presentación (Frontend)

### Objetivo
Visualizar la carrera y los datos en tiempo real.

### Tecnologías sugeridas
- **React + Vite**
- **TailwindCSS** (para diseño responsivo)
- **Recharts o D3.js** (para gráficos)
- **Socket.IO Client** (para recibir datos en tiempo real)

### Estructura de carpetas

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ TrackView.jsx
│  │  ├─ DriversPanel.jsx
│  │  ├─ StatsPanel.jsx
│  │  ├─ RaceControls.jsx
│  │  └─ TelemetryHUD.jsx
│  ├─ pages/
│  │  └─ Dashboard.jsx
│  ├─ services/
│  │  └─ api.js        # Conexión REST y WebSocket
│  ├─ App.jsx
│  └─ main.jsx
└─ package.json
```

### Principales componentes

| Componente | Descripción |
|-------------|-------------|
| **TrackView** | Renderiza el circuito (SVG o Canvas) y posiciones de los autos. |
| **DriversPanel** | Lista pilotos, posiciones, tiempos y estado del coche. |
| **StatsPanel** | Gráficos de velocidad promedio, tiempos y vueltas rápidas. |
| **RaceControls** | Botones para controlar la simulación (play, pausa, clima). |
| **TelemetryHUD** | Velocidad, RPM, marcha, DRS y estado de neumáticos. |

---

## ⚙️ 2. Capa de Lógica y API Gateway (Backend)

### Objetivo
Centralizar la lógica de comunicación entre el motor de simulación y la interfaz.

### Tecnologías sugeridas
- **Node.js + Express**
- **Socket.IO**
- **MongoDB / PostgreSQL** (opcional)
- **dotenv** (configuración de entorno)

### Estructura de carpetas

```
backend/
├─ src/
│  ├─ controllers/
│  │  ├─ raceController.js
│  │  └─ driversController.js
│  ├─ routes/
│  │  ├─ raceRoutes.js
│  │  └─ driversRoutes.js
│  ├─ simulation/
│  │  └─ raceEngine.js   # Motor de simulación
│  ├─ database/
│  │  └─ index.js
│  ├─ app.js
│  └─ server.js
└─ package.json
```

### Endpoints principales

| Endpoint | Método | Descripción |
|-----------|---------|-------------|
| `/api/track` | GET | Obtiene geometría de la pista. |
| `/api/drivers` | GET | Lista los pilotos y equipos. |
| `/api/state` | GET | Devuelve estado actual de la carrera. |
| `/ws/race` | WS | Transmite actualizaciones de carrera en tiempo real. |

### Ejemplo básico (Node.js)

```js
// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import raceEngine from "./simulation/raceEngine.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

raceEngine(io); // envía actualizaciones por socket

app.get("/api/drivers", (req, res) => {
  res.json([{ name: "Verstappen" }, { name: "Hamilton" }]);
});

server.listen(4000, () => console.log("API Gateway running on port 4000"));
```

---

## 🔢 3. Capa de Simulación y Datos

### Objetivo
Simular el movimiento y telemetría de los autos.

### Componentes principales
1. **Race Engine**: motor que genera posiciones y eventos.
2. **Database**: opcional para guardar historial o datos reales.
3. **Data feeds**: conexión a APIs reales como [Ergast API](https://ergast.com/mrd/).

### Ejemplo básico del motor

```js
// raceEngine.js
export default function raceEngine(io) {
  const drivers = [
    { id: 1, name: "Verstappen", pos: 0 },
    { id: 2, name: "Hamilton", pos: 0 },
  ];

  setInterval(() => {
    drivers.forEach(d => d.pos += Math.random() * 5);
    io.emit("race:update", drivers);
  }, 500);
}
```

---

## ☁️ Despliegue

| Componente | Opción sugerida |
|-------------|----------------|
| Frontend | Azure Static Web Apps / Vercel / Netlify |
| Backend | Azure App Service / Render / Docker |
| Base de datos | Azure Cosmos DB / PostgreSQL |
| Comunicación | WebSocket (Socket.IO) |

---

## 🔮 Extensiones futuras

- Clima dinámico y condiciones de pista.
- IA para predicción de estrategias.
- Reproducción de carreras históricas (modo replay).
- Simulación 3D con Three.js o Unreal Engine.
- Panel de ingeniero con control de estrategia.

---

## 🧱 Requisitos iniciales

| Requisito | Descripción |
|------------|-------------|
| Node.js | >= 18 |
| NPM / PNPM | Manejador de paquetes |
| Navegador moderno | Chrome, Edge, Firefox |
| API Key (opcional) | Para datos reales de Fórmula 1 |

---

## 🚀 Cómo iniciar

```bash
# Clonar proyecto
git clone https://github.com/tuusuario/f1-dashboard.git

# Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# Iniciar backend
npm run dev

# Iniciar frontend
npm run dev
```

---

## 🧠 Autor
**[Tu Nombre]** — Proyecto educativo de simulación de telemetría y visualización en tiempo real para Fórmula 1.
