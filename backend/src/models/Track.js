import { getDb } from '../database/db.js';

class Track {
    static async getAll() {
        const db = await getDb();
        return db.prepare('SELECT * FROM tracks ORDER BY name').all();
    }

    static async getById(id) {
        const db = await getDb();
        return db.prepare('SELECT * FROM tracks WHERE id = ?').get(id);
    }

    static async getByCountry(country) {
        const db = await getDb();
        return db.prepare('SELECT * FROM tracks WHERE country = ?').all(country);
    }

    static async getRandom() {
        const db = await getDb();
        return db.prepare('SELECT * FROM tracks ORDER BY RANDOM() LIMIT 1').get();
    }

    static async create(data) {
        const db = await getDb();
        const stmt = db.prepare(`
            INSERT INTO tracks (name, country, city, length_km, laps, corners, drs_zones, svg_path)
            VALUES (@name, @country, @city, @length_km, @laps, @corners, @drs_zones, @svg_path)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Track;
