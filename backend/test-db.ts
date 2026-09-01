import 'dotenv/config';
import pg from 'pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new pg.Pool({ connectionString });
  
  try {
    const res = await pool.query('SELECT * FROM "Listing"');
    console.log('Total listings in DB:', res.rows.length);
    if (res.rows.length > 0) {
      console.log('Sample listing:', res.rows[0].id, res.rows[0].status);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
