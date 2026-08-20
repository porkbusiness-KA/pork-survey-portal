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
        district VARCHAR(100) NOT NULL,
        place VARCHAR(255) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        shop_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
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
