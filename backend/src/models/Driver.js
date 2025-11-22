import { getDb } from '../database/db.js';

class Driver {
    static async getAll() {
        const db = await getDb();
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            ORDER BY d.number
        `).all();
    }

    static async getById(id) {
        const db = await getDb();
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.id = ?
        `).get(id);
    }

    static async getByAbbreviation(abbr) {
        const db = await getDb();
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.abbreviation = ?
        `).get(abbr);
    }

    static async getByTeam(teamId) {
        const db = await getDb();
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.team_id = ?
        `).all(teamId);
    }

    static async create(data) {
        const db = await getDb();
        const stmt = db.prepare(`
            INSERT INTO drivers (name, abbreviation, number, team_id, country, photo_url)
            VALUES (@name, @abbreviation, @number, @team_id, @country, @photo_url)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Driver;
