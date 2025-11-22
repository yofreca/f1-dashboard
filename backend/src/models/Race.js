import { getDb } from '../database/db.js';

class Race {
    static async getAll() {
        const db = await getDb();
        return db.prepare(`
            SELECT r.*, t.name as track_name, t.country as track_country
            FROM races r
            JOIN tracks t ON r.track_id = t.id
            ORDER BY r.created_at DESC
        `).all();
    }

    static async getById(id) {
        const db = await getDb();
        return db.prepare(`
            SELECT r.*, t.name as track_name, t.country as track_country,
                   t.length_km, t.corners, t.drs_zones
            FROM races r
            JOIN tracks t ON r.track_id = t.id
            WHERE r.id = ?
        `).get(id);
    }

    static async getActive() {
        const db = await getDb();
        return db.prepare(`
            SELECT r.*, t.name as track_name, t.country as track_country
            FROM races r
            JOIN tracks t ON r.track_id = t.id
            WHERE r.status IN ('running', 'paused')
            ORDER BY r.created_at DESC
            LIMIT 1
        `).get();
    }

    static async create(trackId, totalLaps) {
        const db = await getDb();
        const stmt = db.prepare(`
            INSERT INTO races (track_id, total_laps, status)
            VALUES (?, ?, 'pending')
        `);
        const result = stmt.run(trackId, totalLaps);
        return this.getById(result.lastInsertRowid);
    }

    static async updateStatus(id, status) {
        const db = await getDb();
        if (status === 'running') {
            db.prepare('UPDATE races SET status = ?, started_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(status, id);
        } else if (status === 'finished') {
            db.prepare('UPDATE races SET status = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?')
                .run(status, id);
        } else {
            db.prepare('UPDATE races SET status = ? WHERE id = ?').run(status, id);
        }
        return this.getById(id);
    }

    static async updateLap(id, lap) {
        const db = await getDb();
        db.prepare('UPDATE races SET current_lap = ? WHERE id = ?').run(lap, id);
        return this.getById(id);
    }

    static async updateWeather(id, weather) {
        const db = await getDb();
        db.prepare('UPDATE races SET weather = ? WHERE id = ?').run(weather, id);
        return this.getById(id);
    }

    static async getPositions(raceId) {
        const db = await getDb();
        return db.prepare(`
            SELECT rp.*, d.name as driver_name, d.abbreviation, d.number,
                   t.name as team_name, t.color as team_color
            FROM race_positions rp
            JOIN drivers d ON rp.driver_id = d.id
            JOIN teams t ON d.team_id = t.id
            WHERE rp.race_id = ?
            ORDER BY rp.position
        `).all(raceId);
    }

    static async setPosition(raceId, driverId, positionData) {
        const db = await getDb();
        const existing = db.prepare(
            'SELECT id FROM race_positions WHERE race_id = ? AND driver_id = ?'
        ).get(raceId, driverId);

        if (existing) {
            db.prepare(`
                UPDATE race_positions
                SET position = @position, lap = @lap, gap_to_leader = @gap_to_leader,
                    gap_to_ahead = @gap_to_ahead, last_lap_time = @last_lap_time,
                    best_lap_time = @best_lap_time, pit_stops = @pit_stops, status = @status
                WHERE race_id = @race_id AND driver_id = @driver_id
            `).run({ ...positionData, race_id: raceId, driver_id: driverId });
        } else {
            db.prepare(`
                INSERT INTO race_positions
                (race_id, driver_id, position, lap, gap_to_leader, gap_to_ahead,
                 last_lap_time, best_lap_time, pit_stops, status)
                VALUES (@race_id, @driver_id, @position, @lap, @gap_to_leader, @gap_to_ahead,
                        @last_lap_time, @best_lap_time, @pit_stops, @status)
            `).run({ ...positionData, race_id: raceId, driver_id: driverId });
        }
    }
}

export default Race;
