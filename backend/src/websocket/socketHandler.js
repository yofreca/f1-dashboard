export function setupSocketHandlers(io, raceEngine) {
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // Enviar estado actual al conectarse
        socket.emit('race:state', raceEngine.getState());

        // Control de carrera
        socket.on('race:start', (data) => {
            console.log('Starting race...', data);
            raceEngine.start(data?.trackId);
            io.emit('race:started', raceEngine.getState());
        });

        socket.on('race:pause', () => {
            console.log('Pausing race...');
            raceEngine.pause();
            io.emit('race:paused', raceEngine.getState());
        });

        socket.on('race:resume', () => {
            console.log('Resuming race...');
            raceEngine.resume();
            io.emit('race:resumed', raceEngine.getState());
        });

        socket.on('race:stop', () => {
            console.log('Stopping race...');
            raceEngine.stop();
            io.emit('race:stopped', raceEngine.getState());
        });

        socket.on('race:reset', () => {
            console.log('Resetting race...');
            raceEngine.reset();
            io.emit('race:reset', raceEngine.getState());
        });

        // Control de velocidad de simulación
        socket.on('race:speed', (speed) => {
            console.log(`Setting simulation speed: ${speed}x`);
            raceEngine.setSpeed(speed);
        });

        // Control de clima
        socket.on('race:weather', (weather) => {
            console.log(`Changing weather to: ${weather}`);
            raceEngine.setWeather(weather);
            io.emit('race:weather_changed', { weather });
        });

        // Seleccionar piloto para telemetría detallada
        socket.on('telemetry:select', (driverId) => {
            socket.join(`telemetry:${driverId}`);
            console.log(`Client ${socket.id} subscribed to telemetry for driver ${driverId}`);
        });

        socket.on('telemetry:unselect', (driverId) => {
            socket.leave(`telemetry:${driverId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    // Configurar eventos del motor de carrera
    raceEngine.on('update', (data) => {
        io.emit('race:update', data);
    });

    raceEngine.on('lap_completed', (data) => {
        io.emit('race:lap_completed', data);
    });

    raceEngine.on('overtake', (data) => {
        io.emit('race:overtake', data);
    });

    raceEngine.on('pit_stop', (data) => {
        io.emit('race:pit_stop', data);
    });

    raceEngine.on('finished', (data) => {
        io.emit('race:finished', data);
    });

    raceEngine.on('telemetry', (driverId, data) => {
        io.to(`telemetry:${driverId}`).emit('telemetry:update', data);
    });
}
