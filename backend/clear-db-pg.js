const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query('DROP TABLE IF EXISTS "RefreshToken" CASCADE');
    console.log('Dropped RefreshToken');
  } catch (err) {
    console.error('Error dropping RefreshToken:', err.message);
  } finally {
    await pool.end();
  }
}

run();
