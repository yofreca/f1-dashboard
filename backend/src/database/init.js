import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Inicializando base de datos F1...');

// Leer y ejecutar el esquema SQL
const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Ejecutar cada statement por separado
const statements = schema.split(';').filter(s => s.trim());

for (const statement of statements) {
    if (statement.trim()) {
        try {
            db.exec(statement);
        } catch (error) {
            console.error('Error ejecutando:', statement.substring(0, 50) + '...');
            console.error(error.message);
        }
    }
}

console.log('Base de datos inicializada correctamente');
db.close();
