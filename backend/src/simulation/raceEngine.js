import { EventEmitter } from 'events';
import Driver from '../models/Driver.js';
import Track from '../models/Track.js';
import Race from '../models/Race.js';

class RaceEngine extends EventEmitter {
    constructor(io) {
        super();
        this.io = io;
        this.state = {
            status: 'idle', // idle, running, paused, finished
            currentLap: 0,
            totalLaps: 0,
            weather: 'dry',
            trackId: null,
            track: null,
            raceId: null,
            elapsedTime: 0
        };
        this.drivers = [];
        this.interval = null;
        this.tickRate = 100; // ms entre actualizaciones
        this.speed = 1; // multiplicador de velocidad
    }

    async initializeDrivers() {
        const allDrivers = await Driver.getAll();
        this.drivers = allDrivers.map((driver, index) => ({
            ...driver,
            position: index + 1,
            trackPosition: 0, // 0-100% de la pista
            lap: 0,
            speed: 0,
            rpm: 0,
            gear: 1,
            throttle: 0,
            brake: 0,
            drs: false,
            tireCompound: this.getRandomTire(),
            tireWear: 0,
            fuel: 100,
            pitStops: 0,
            gapToLeader: 0,
            gapToAhead: 0,
            lastLapTime: null,
            bestLapTime: null,
            status: 'racing', // racing, pit, out, finished
            // Características aleatorias del piloto
            skill: 0.8 + Math.random() * 0.2,
            aggression: 0.3 + Math.random() * 0.7,
            consistency: 0.7 + Math.random() * 0.3
        }));
    }

    getRandomTire() {
        const tires = ['soft', 'medium', 'hard'];
        return tires[Math.floor(Math.random() * tires.length)];
    }

    async start(trackId) {
        console.log('Starting race with trackId:', trackId);

        // Obtener pista
        const track = trackId ? await Track.getById(trackId) : await Track.getRandom();
        console.log('Track found:', track);

        if (!track) {
            console.error('No track found! Make sure to run: npm run db:init && npm run db:seed');
            return;
        }

        this.state.track = track;
        this.state.trackId = track.id;
        this.state.totalLaps = Math.min(track.laps, 20); // Limitar vueltas para demo
        this.state.currentLap = 1;
        this.state.status = 'running';
        this.state.elapsedTime = 0;

        // Crear carrera en DB
        const race = await Race.create(track.id, this.state.totalLaps);
        console.log('Race object:', race);

        if (!race) {
            console.error('Failed to create race! Database may not be initialized.');
            return;
        }

        this.state.raceId = race.id;
        await Race.updateStatus(race.id, 'running');

        // Inicializar pilotos
        await this.initializeDrivers();

        // Iniciar bucle de simulación
        this.startLoop();

        console.log(`Race started at ${track.name} - ${this.state.totalLaps} laps`);
    }

    startLoop() {
        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            this.tick();
        }, this.tickRate);
    }

    tick() {
        if (this.state.status !== 'running') return;

        const deltaTime = (this.tickRate / 1000) * this.speed;
        this.state.elapsedTime += deltaTime;

        // Actualizar cada piloto
        this.drivers.forEach(driver => {
            if (driver.status !== 'racing') return;
            this.updateDriver(driver, deltaTime);
        });

        // Calcular posiciones
        this.calculatePositions();

        // Verificar si la carrera terminó
        this.checkRaceEnd();

        // Emitir actualización
        this.emit('update', this.getState());
    }

    updateDriver(driver, deltaTime) {
        // Calcular velocidad base según condiciones
        const baseSpeed = this.calculateBaseSpeed(driver);

        // Aplicar variación de habilidad
        const speedVariation = (Math.random() - 0.5) * 5 * (1 - driver.consistency);
        driver.speed = Math.max(150, Math.min(350, baseSpeed + speedVariation));

        // Calcular RPM basado en velocidad
        driver.rpm = Math.floor(8000 + (driver.speed / 350) * 7000);

        // Calcular marcha
        driver.gear = Math.min(8, Math.max(1, Math.ceil(driver.speed / 45)));

        // Throttle y brake simulados
        driver.throttle = 0.7 + Math.random() * 0.3;
        driver.brake = Math.random() < 0.2 ? Math.random() * 0.8 : 0;

        // DRS disponible después de vuelta 2
        driver.drs = this.state.currentLap > 2 && Math.random() > 0.7;

        // Desgaste de neumáticos
        const wearRate = this.getTireWearRate(driver.tireCompound);
        driver.tireWear = Math.min(100, driver.tireWear + wearRate * deltaTime);

        // Consumo de combustible
        driver.fuel = Math.max(0, driver.fuel - 0.05 * deltaTime);

        // Actualizar posición en pista (0-100)
        const progressRate = (driver.speed / 300) * (5 / (this.state.track?.length_km || 5));
        driver.trackPosition += progressRate * deltaTime * 10;

        // Verificar si completó una vuelta
        if (driver.trackPosition >= 100) {
            this.completeLap(driver);
        }

        // Emitir telemetría detallada
        this.emit('telemetry', driver.id, {
            driverId: driver.id,
            speed: driver.speed,
            rpm: driver.rpm,
            gear: driver.gear,
            throttle: driver.throttle,
            brake: driver.brake,
            drs: driver.drs,
            tireWear: driver.tireWear,
            fuel: driver.fuel,
            trackPosition: driver.trackPosition
        });
    }

    calculateBaseSpeed(driver) {
        let speed = 280;

        // Efecto del clima
        if (this.state.weather === 'wet') speed *= 0.85;
        if (this.state.weather === 'mixed') speed *= 0.92;

        // Efecto del desgaste de neumáticos
        speed *= (1 - driver.tireWear / 200);

        // Efecto del combustible (más ligero = más rápido)
        speed *= (1 + (100 - driver.fuel) / 500);

        // Habilidad del piloto
        speed *= driver.skill;

        return speed;
    }

    getTireWearRate(compound) {
        const rates = {
            soft: 0.8,
            medium: 0.5,
            hard: 0.3,
            intermediate: 0.6,
            wet: 0.4
        };
        return rates[compound] || 0.5;
    }

    completeLap(driver) {
        driver.trackPosition -= 100;
        driver.lap++;

        // Calcular tiempo de vuelta
        const lapTime = 60 + Math.random() * 30 + (driver.tireWear / 10);
        driver.lastLapTime = lapTime;

        if (!driver.bestLapTime || lapTime < driver.bestLapTime) {
            driver.bestLapTime = lapTime;
        }

        // Verificar si necesita pit stop
        if (driver.tireWear > 70 && Math.random() > 0.5) {
            this.pitStop(driver);
        }

        this.emit('lap_completed', {
            driverId: driver.id,
            driverName: driver.name,
            lap: driver.lap,
            lapTime: driver.lastLapTime,
            bestLapTime: driver.bestLapTime
        });

        // Actualizar vuelta actual de la carrera
        const maxLap = Math.max(...this.drivers.map(d => d.lap));
        if (maxLap > this.state.currentLap) {
            this.state.currentLap = maxLap;
        }
    }

    pitStop(driver) {
        driver.status = 'pit';
        driver.pitStops++;

        this.emit('pit_stop', {
            driverId: driver.id,
            driverName: driver.name,
            pitStops: driver.pitStops
        });

        // Simular parada (penalización de posición)
        driver.trackPosition -= 20;

        // Nuevo compuesto y reset de desgaste
        driver.tireCompound = this.getRandomTire();
        driver.tireWear = 0;
        driver.fuel = 100;

        setTimeout(() => {
            driver.status = 'racing';
        }, 2000 / this.speed);
    }

    calculatePositions() {
        // Ordenar por vuelta y posición en pista
        const sorted = [...this.drivers]
            .filter(d => d.status !== 'out')
            .sort((a, b) => {
                if (a.lap !== b.lap) return b.lap - a.lap;
                return b.trackPosition - a.trackPosition;
            });

        // Asignar posiciones y calcular gaps
        sorted.forEach((driver, index) => {
            const oldPosition = driver.position;
            driver.position = index + 1;

            // Calcular gap al líder
            if (index === 0) {
                driver.gapToLeader = 0;
                driver.gapToAhead = 0;
            } else {
                const leader = sorted[0];
                const ahead = sorted[index - 1];

                driver.gapToLeader = ((leader.lap - driver.lap) * 100 +
                    (leader.trackPosition - driver.trackPosition)) / 10;
                driver.gapToAhead = ((ahead.lap - driver.lap) * 100 +
                    (ahead.trackPosition - driver.trackPosition)) / 10;
            }

            // Detectar adelantamiento
            if (oldPosition > driver.position && oldPosition > 0) {
                this.emit('overtake', {
                    driverId: driver.id,
                    driverName: driver.name,
                    newPosition: driver.position,
                    oldPosition: oldPosition
                });
            }
        });
    }

    checkRaceEnd() {
        // Verificar si el líder completó todas las vueltas
        const leader = this.drivers.find(d => d.position === 1);
        if (leader && leader.lap >= this.state.totalLaps) {
            this.finish();
        }
    }

    async finish() {
        this.state.status = 'finished';
        this.stop();

        // Marcar a todos como finished
        this.drivers.forEach(d => {
            if (d.status === 'racing') d.status = 'finished';
        });

        // Actualizar en DB
        if (this.state.raceId) {
            await Race.updateStatus(this.state.raceId, 'finished');
        }

        this.emit('finished', {
            results: this.drivers
                .filter(d => d.status !== 'out')
                .sort((a, b) => a.position - b.position)
                .map(d => ({
                    position: d.position,
                    driverId: d.id,
                    driverName: d.name,
                    team: d.team_name,
                    bestLapTime: d.bestLapTime,
                    pitStops: d.pitStops
                }))
        });

        console.log('Race finished!');
    }

    async pause() {
        this.state.status = 'paused';
        if (this.state.raceId) {
            await Race.updateStatus(this.state.raceId, 'paused');
        }
    }

    async resume() {
        if (this.state.status === 'paused') {
            this.state.status = 'running';
            if (this.state.raceId) {
                await Race.updateStatus(this.state.raceId, 'running');
            }
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        // Reset state to allow restart
        this.state.status = 'idle';
        this.state.raceId = null;
        this.drivers = [];
        console.log('Race stopped, ready for new race');
    }

    reset() {
        this.stop();
        this.state = {
            status: 'idle',
            currentLap: 0,
            totalLaps: 0,
            weather: 'dry',
            trackId: null,
            track: null,
            raceId: null,
            elapsedTime: 0
        };
        this.drivers = [];
        console.log('Race reset complete');
    }

    setSpeed(speed) {
        this.speed = Math.max(0.5, Math.min(4, speed));
    }

    async setWeather(weather) {
        if (['dry', 'wet', 'mixed'].includes(weather)) {
            this.state.weather = weather;
            if (this.state.raceId) {
                await Race.updateWeather(this.state.raceId, weather);
            }
        }
    }

    getState() {
        return {
            ...this.state,
            drivers: this.drivers.map(d => ({
                id: d.id,
                name: d.name,
                abbreviation: d.abbreviation,
                number: d.number,
                team: d.team_name,
                teamColor: d.team_color,
                position: d.position,
                lap: d.lap,
                trackPosition: d.trackPosition,
                speed: Math.round(d.speed),
                gapToLeader: d.gapToLeader?.toFixed(3) || '0.000',
                gapToAhead: d.gapToAhead?.toFixed(3) || '0.000',
                lastLapTime: d.lastLapTime?.toFixed(3),
                bestLapTime: d.bestLapTime?.toFixed(3),
                tireCompound: d.tireCompound,
                tireWear: Math.round(d.tireWear),
                pitStops: d.pitStops,
                status: d.status
            })),
            speed: this.speed
        };
    }
}

export default RaceEngine;
