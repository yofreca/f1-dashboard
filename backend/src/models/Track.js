import db from '../database/db.js';

class Track {
    static getAll() {
        return db.prepare('SELECT * FROM tracks ORDER BY name').all();
    }

    static getById(id) {
        return db.prepare('SELECT * FROM tracks WHERE id = ?').get(id);
    }

    static getByCountry(country) {
        return db.prepare('SELECT * FROM tracks WHERE country = ?').all(country);
    }

    static getRandom() {
        return db.prepare('SELECT * FROM tracks ORDER BY RANDOM() LIMIT 1').get();
    }

    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO tracks (name, country, city, length_km, laps, corners, drs_zones, svg_path)
            VALUES (@name, @country, @city, @length_km, @laps, @corners, @drs_zones, @svg_path)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Track;
