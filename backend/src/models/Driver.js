import db from '../database/db.js';

class Driver {
    static getAll() {
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            ORDER BY d.number
        `).all();
    }

    static getById(id) {
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.id = ?
        `).get(id);
    }

    static getByAbbreviation(abbr) {
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.abbreviation = ?
        `).get(abbr);
    }

    static getByTeam(teamId) {
        return db.prepare(`
            SELECT d.*, t.name as team_name, t.color as team_color
            FROM drivers d
            JOIN teams t ON d.team_id = t.id
            WHERE d.team_id = ?
        `).all(teamId);
    }

    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO drivers (name, abbreviation, number, team_id, country, photo_url)
            VALUES (@name, @abbreviation, @number, @team_id, @country, @photo_url)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Driver;
