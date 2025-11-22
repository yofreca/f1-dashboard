import db from '../database/db.js';

class Team {
    static getAll() {
        return db.prepare('SELECT * FROM teams ORDER BY name').all();
    }

    static getById(id) {
        return db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    }

    static getByName(name) {
        return db.prepare('SELECT * FROM teams WHERE name = ?').get(name);
    }

    static getWithDrivers(id) {
        const team = this.getById(id);
        if (!team) return null;

        const drivers = db.prepare('SELECT * FROM drivers WHERE team_id = ?').all(id);
        return { ...team, drivers };
    }

    static create(data) {
        const stmt = db.prepare(`
            INSERT INTO teams (name, full_name, color, secondary_color, country)
            VALUES (@name, @full_name, @color, @secondary_color, @country)
        `);
        const result = stmt.run(data);
        return this.getById(result.lastInsertRowid);
    }
}

export default Team;
