const { Pool } = require('pg');

async function waitForDB(pool, retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database pronto!');
      return;
    } catch (err) {
      console.log(`DB non ancora pronto... tentativo ${i + 1}/${retries}`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Impossibile connettersi al DB dopo vari tentativi');
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

waitForDB(pool); 

module.exports = pool;
