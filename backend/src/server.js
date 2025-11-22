import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { setupSocketHandlers } from './websocket/socketHandler.js';
import RaceEngine from './simulation/raceEngine.js';

const PORT = process.env.PORT || 4000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Instanciar el motor de carrera
const raceEngine = new RaceEngine(io);

// Configurar handlers de WebSocket
setupSocketHandlers(io, raceEngine);

// Exponer raceEngine para las rutas
app.set('raceEngine', raceEngine);

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`
    ==========================================
         F1 Dashboard Backend
    ==========================================
    Server running on port ${PORT}
    API: http://localhost:${PORT}/api
    WebSocket: ws://localhost:${PORT}
    ==========================================
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    raceEngine.stop();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
