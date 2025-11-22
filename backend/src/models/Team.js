import { getDb } from '../database/db.js';

class Team {
    static async getAll() {
        const db = await getDb();
        return db.prepare('SELECT * FROM teams ORDER BY name').all();
    }

    static async getById(id) {
        const db = await getDb();
        return db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    }

    static async getByName(name) {
        const db = await getDb();
        return db.prepare('SELECT * FROM teams WHERE name = ?').get(name);
    }

    static async getWithDrivers(id) {
        const db = await getDb();
        const team = await this.getById(id);
        if (!team) return null;

        const drivers = db.prepare('SELECT * FROM drivers WHERE team_id = ?').all(id);
        return { ...team, drivers };
    }

    static async create(data) {
        const db = await getDb();
        const stmt = db.prepare(`
            INSERT INTO teams (name, full_name, color, secondary_color, country)
            VALUES (@name, @full_name, @color, @secondary_color, @country)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Team;
