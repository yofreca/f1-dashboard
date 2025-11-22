import initSqlJs from 'sql.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/f1.db');

// Asegurar que el directorio existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db = null;
let SQL = null;

// Guardar base de datos a disco
function saveDb() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
}

// Inicializar SQL.js
async function initDb() {
    if (db) return db;

    SQL = await initSqlJs();

    // Cargar base de datos existente o crear nueva
    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Habilitar foreign keys
    db.run('PRAGMA foreign_keys = ON');

    return db;
}

// Wrapper para compatibilidad con better-sqlite3 API
class DatabaseWrapper {
    constructor(database) {
        this._db = database;
    }

    prepare(sql) {
        const self = this;
        return {
            run(...params) {
                try {
                    // Manejar parámetros nombrados (@name)
                    if (params.length === 1 && typeof params[0] === 'object' && !Array.isArray(params[0])) {
                        const obj = params[0];
                        const namedParams = {};
                        for (const [key, value] of Object.entries(obj)) {
                            namedParams[`@${key}`] = value;
                        }
                        self._db.run(sql, namedParams);
                    } else {
                        self._db.run(sql, params);
                    }
                    saveDb();
                    const lastId = self._db.exec('SELECT last_insert_rowid() as id');
                    return {
                        lastInsertRowid: lastId[0]?.values[0]?.[0] || 0,
                        changes: self._db.getRowsModified()
                    };
                } catch (e) {
                    console.error('SQL Error:', e.message);
                    throw e;
                }
            },
            get(...params) {
                try {
                    const stmt = self._db.prepare(sql);
                    if (params.length > 0) {
                        stmt.bind(params);
                    }
                    if (stmt.step()) {
                        const columns = stmt.getColumnNames();
                        const values = stmt.get();
                        stmt.free();
                        const row = {};
                        columns.forEach((col, i) => row[col] = values[i]);
                        return row;
                    }
                    stmt.free();
                    return undefined;
                } catch (e) {
                    console.error('SQL Error:', e.message);
                    throw e;
                }
            },
            all(...params) {
                try {
                    const stmt = self._db.prepare(sql);
                    if (params.length > 0) {
                        stmt.bind(params);
                    }
                    const rows = [];
                    while (stmt.step()) {
                        const columns = stmt.getColumnNames();
                        const values = stmt.get();
                        const row = {};
                        columns.forEach((col, i) => row[col] = values[i]);
                        rows.push(row);
                    }
                    stmt.free();
                    return rows;
                } catch (e) {
                    console.error('SQL Error:', e.message);
                    throw e;
                }
            }
        };
    }

    exec(sql) {
        this._db.run(sql);
        saveDb();
    }

    pragma(pragma) {
        this._db.run(`PRAGMA ${pragma}`);
    }

    close() {
        if (this._db) {
            saveDb();
            this._db.close();
        }
    }

    transaction(fn) {
        return (...args) => {
            this._db.run('BEGIN TRANSACTION');
            try {
                const result = fn(...args);
                this._db.run('COMMIT');
                saveDb();
                return result;
            } catch (e) {
                this._db.run('ROLLBACK');
                throw e;
            }
        };
    }
}

// Singleton del wrapper
let dbWrapper = null;

export async function getDb() {
    if (!dbWrapper) {
        const database = await initDb();
        dbWrapper = new DatabaseWrapper(database);
    }
    return dbWrapper;
}

export default { getDb };
