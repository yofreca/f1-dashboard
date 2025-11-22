-- Esquema de base de datos F1 Dashboard

-- Tabla de equipos
CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    color TEXT NOT NULL,
    secondary_color TEXT,
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pilotos
CREATE TABLE IF NOT EXISTS drivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    number INTEGER NOT NULL,
    team_id INTEGER NOT NULL,
    country TEXT NOT NULL,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Tabla de circuitos
CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    length_km REAL NOT NULL,
    laps INTEGER NOT NULL,
    corners INTEGER NOT NULL,
    drs_zones INTEGER DEFAULT 2,
    svg_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carreras
CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'paused', 'finished', 'red_flag')),
    weather TEXT DEFAULT 'dry' CHECK (weather IN ('dry', 'wet', 'mixed')),
    current_lap INTEGER DEFAULT 0,
    total_laps INTEGER NOT NULL,
    started_at DATETIME,
    finished_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (track_id) REFERENCES tracks(id)
);

-- Tabla de posiciones en carrera
CREATE TABLE IF NOT EXISTS race_positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    position INTEGER NOT NULL,
    lap INTEGER NOT NULL,
    gap_to_leader REAL DEFAULT 0,
    gap_to_ahead REAL DEFAULT 0,
    last_lap_time REAL,
    best_lap_time REAL,
    pit_stops INTEGER DEFAULT 0,
    status TEXT DEFAULT 'racing' CHECK (status IN ('racing', 'pit', 'out', 'finished')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Tabla de telemetría en tiempo real
CREATE TABLE IF NOT EXISTS telemetry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id INTEGER NOT NULL,
    driver_id INTEGER NOT NULL,
    lap INTEGER NOT NULL,
    track_position REAL NOT NULL,
    speed REAL NOT NULL,
    rpm INTEGER NOT NULL,
    gear INTEGER NOT NULL,
    throttle REAL DEFAULT 0,
    brake REAL DEFAULT 0,
    drs_active INTEGER DEFAULT 0,
    tire_compound TEXT DEFAULT 'medium' CHECK (tire_compound IN ('soft', 'medium', 'hard', 'intermediate', 'wet')),
    tire_wear REAL DEFAULT 0,
    fuel_load REAL DEFAULT 100,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_drivers_team ON drivers(team_id);
CREATE INDEX IF NOT EXISTS idx_races_track ON races(track_id);
CREATE INDEX IF NOT EXISTS idx_race_positions_race ON race_positions(race_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_race_driver ON telemetry(race_id, driver_id);
