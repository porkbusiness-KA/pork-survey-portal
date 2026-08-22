const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'pork_survey_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0
});

async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log(' Connected to MySQL database:', process.env.DB_NAME || 'pork_survey_db');

    // Create table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS surveys (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country VARCHAR(100) DEFAULT 'India',
        state VARCHAR(100) DEFAULT 'Karnataka',
        district VARCHAR(100) NOT NULL,
        taluk VARCHAR(150) DEFAULT '',
        village VARCHAR(255) DEFAULT '',
        place VARCHAR(255) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        shop_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        owner_mobile VARCHAR(20) DEFAULT '',
        owner_email VARCHAR(150) DEFAULT '',
        years_in_business INT DEFAULT 0,
        opening_time VARCHAR(50) NOT NULL,
        closing_time VARCHAR(50) NOT NULL,
        holiday_days JSON,
        workers_count VARCHAR(50) NOT NULL,
        daily_customers VARCHAR(50),
        peak_customer_days JSON,
        regular_meat_rate DECIMAL(10, 2) NOT NULL,
        meat_types JSON NOT NULL,
        processed_meat_consumption JSON,
        average_daily_sale_kg DECIMAL(10, 2) DEFAULT 0,
        procurement_source VARCHAR(255),
        customer_type VARCHAR(100),
        masalas_available JSON,
        bbmp_license_issued VARCHAR(10) DEFAULT 'No',
        bbmp_license_issues VARCHAR(10) DEFAULT 'No',
        bbmp_issue_reasons TEXT,
        cleanliness_rating INT DEFAULT 3,
        spoc_name VARCHAR(255) NOT NULL,
        spoc_mobile VARCHAR(20),
        location_link TEXT NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        shop_images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_district (district),
        INDEX idx_pincode (pincode),
        INDEX idx_shop_name (shop_name),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(createTableQuery);

    // Auto-migration helper for existing tables
    const addColumnIfNotExists = async (columnName, columnDefinition) => {
      try {
        const [existing] = await connection.query(`SHOW COLUMNS FROM surveys LIKE ?`, [columnName]);
        if (existing.length === 0) {
          await connection.query(`ALTER TABLE surveys ADD COLUMN ${columnName} ${columnDefinition}`);
          console.log(` Added column: ${columnName}`);
        }
      } catch (err) {
        console.warn(`Column check warning for ${columnName}:`, err.message);
      }
    };

    await addColumnIfNotExists('country', "VARCHAR(100) DEFAULT 'India'");
    await addColumnIfNotExists('state', "VARCHAR(100) DEFAULT 'Karnataka'");
    await addColumnIfNotExists('taluk', "VARCHAR(150) DEFAULT ''");
    await addColumnIfNotExists('village', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('owner_mobile', "VARCHAR(20) DEFAULT ''");
    await addColumnIfNotExists('owner_email', "VARCHAR(150) DEFAULT ''");

    console.log(' Surveys table verified/created successfully.');
    connection.release();
  } catch (error) {
    console.error(' MySQL Initialization Error:', error.message);
  }
}

module.exports = {
  pool,
  initDatabase
};
