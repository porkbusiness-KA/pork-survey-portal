const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pork_survey_db'
  });

  console.log('Connected to MySQL');

  const dropCol = async (col) => {
    try {
      const [rows] = await connection.query(`SHOW COLUMNS FROM surveys LIKE ?`, [col]);
      if (rows.length > 0) {
        await connection.query(`ALTER TABLE surveys DROP COLUMN \`${col}\``);
        console.log(`Dropped column: ${col}`);
      } else {
        console.log(`Column ${col} does not exist.`);
      }
    } catch (err) {
      console.error(`Error dropping ${col}:`, err.message);
    }
  };

  await dropCol('peak_sales_seasons');
  await dropCol('peak_sales_seasons_other');

  await connection.end();
  console.log('Migration complete!');
}

run();
