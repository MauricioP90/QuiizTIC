import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306')
};

console.log('--- DIAGNÓSTICO DE CONEXIÓN ---');
console.log('Host:', config.host);
console.log('User:', config.user);
console.log('Database:', config.database);
console.log('Port:', config.port);
console.log('Password length:', config.password ? config.password.length : 0);
console.log('Password starts with:', config.password ? config.password.substring(0, 3) : 'N/A');

async function test() {
  try {
    const conn = await mysql.createConnection(config);
    console.log('¡Conexión exitosa a MySQL!');
    await conn.end();
  } catch (err: any) {
    console.error('Error de conexión:', err.message);
  }
}

test();
