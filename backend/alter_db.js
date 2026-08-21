require('dotenv').config();
const mysql = require('mysql2/promise');

async function addColumn() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  
  try {
    await pool.query('ALTER TABLE surveys ADD COLUMN behavior_rating INT DEFAULT 4 AFTER cleanliness_rating');
    console.log('Successfully added behavior_rating column');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
       console.log('Column already exists');
    } else {
       console.error('Error:', e);
    }
  }
  process.exit();
}

addColumn();
