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
        shop_ownership VARCHAR(100) DEFAULT '',
        shop_ownership_other VARCHAR(255) DEFAULT '',
        years_in_business INT DEFAULT 0,
        owner_community VARCHAR(100) DEFAULT '',
        owner_community_other VARCHAR(255) DEFAULT '',
        handi_jogi_area VARCHAR(150) DEFAULT '',
        handi_jogi_area_other VARCHAR(255) DEFAULT '',
        opening_time VARCHAR(50) NOT NULL,
        closing_time VARCHAR(50) NOT NULL,
        holiday_days JSON,
        workers_count VARCHAR(50) NOT NULL,
        daily_customers VARCHAR(50),
        peak_customer_days JSON,
        regular_meat_rate DECIMAL(10, 2) NOT NULL,
        meat_types JSON NOT NULL,
        meat_cuts_sold_most JSON,
        meat_cuts_sold_most_other VARCHAR(255) DEFAULT '',
        processed_meat_consumption JSON,
        average_daily_sale_kg DECIMAL(10, 2) DEFAULT 0,
        unsold_meat_handling JSON,
        unsold_meat_handling_other VARCHAR(255) DEFAULT '',
        storage_capacity VARCHAR(100) DEFAULT '',
        procurement_source VARCHAR(255),
        procurement_sources JSON,
        procurement_sources_other VARCHAR(255) DEFAULT '',
        procurement_frequency VARCHAR(100) DEFAULT '',
        procurement_frequency_other VARCHAR(255) DEFAULT '',
        procurement_quantity VARCHAR(100) DEFAULT '',
        procurement_quantity_other VARCHAR(255) DEFAULT '',
        customer_type VARCHAR(100),
        sells_pork_fry VARCHAR(10) DEFAULT 'No',
        pork_fry_kg VARCHAR(50) DEFAULT '',
        masalas_available JSON,
        bbmp_license_issued VARCHAR(10) DEFAULT 'No',
        bbmp_license_issues VARCHAR(10) DEFAULT 'No',
        bbmp_issue_reasons TEXT,
        fssai_license_issued VARCHAR(10) DEFAULT 'No',
        fssai_license_issues VARCHAR(10) DEFAULT 'No',
        fssai_issue_reasons TEXT,
        provides_billing VARCHAR(100) DEFAULT '',
        has_challenges VARCHAR(10) DEFAULT 'No',
        business_challenges JSON,
        business_challenges_other VARCHAR(255) DEFAULT '',
        wants_training VARCHAR(10) DEFAULT 'No',
        training_skills JSON,
        training_skills_other VARCHAR(255) DEFAULT '',
        cleanliness_rating INT DEFAULT 3,
        behavior_rating INT DEFAULT 3,
        spocs JSON,
        spoc_name VARCHAR(255) DEFAULT '',
        spoc_mobile VARCHAR(255) DEFAULT '',
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
    await addColumnIfNotExists('shop_ownership', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('shop_ownership_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('owner_community', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('owner_community_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('handi_jogi_area', "VARCHAR(150) DEFAULT ''");
    await addColumnIfNotExists('handi_jogi_area_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('meat_cuts_sold_most', "JSON");
    await addColumnIfNotExists('meat_cuts_sold_most_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('unsold_meat_handling', "JSON");
    await addColumnIfNotExists('unsold_meat_handling_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('storage_capacity', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('procurement_sources', "JSON");
    await addColumnIfNotExists('procurement_sources_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('procurement_frequency', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('procurement_frequency_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('procurement_quantity', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('procurement_quantity_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('provides_billing', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('has_challenges', "VARCHAR(10) DEFAULT 'No'");
    await addColumnIfNotExists('business_challenges', "JSON");
    await addColumnIfNotExists('business_challenges_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('wants_training', "VARCHAR(10) DEFAULT 'No'");
    await addColumnIfNotExists('training_skills', "JSON");
    await addColumnIfNotExists('training_skills_other', "VARCHAR(255) DEFAULT ''");
    await addColumnIfNotExists('customer_type', "VARCHAR(100) DEFAULT 'Localities'");
    await addColumnIfNotExists('workers_other', "VARCHAR(100) DEFAULT ''");
    await addColumnIfNotExists('sells_pork_fry', "VARCHAR(10) DEFAULT 'No'");
    await addColumnIfNotExists('pork_fry_kg', "VARCHAR(50) DEFAULT ''");
    await addColumnIfNotExists('fssai_license_issued', "VARCHAR(10) DEFAULT 'No'");
    await addColumnIfNotExists('fssai_license_issues', "VARCHAR(10) DEFAULT 'No'");
    await addColumnIfNotExists('fssai_issue_reasons', "TEXT");
    await addColumnIfNotExists('behavior_rating', "INT DEFAULT 3");
    await addColumnIfNotExists('spocs', "JSON");

    // Auto-modify column sizes for existing tables
    const modifyColumn = async (columnName, columnDefinition) => {
      try {
        await connection.query(`ALTER TABLE surveys MODIFY COLUMN ${columnName} ${columnDefinition}`);
      } catch (err) {
        console.warn(`Column modify warning for ${columnName}:`, err.message);
      }
    };

    await modifyColumn('spoc_mobile', "VARCHAR(255) DEFAULT ''");
    await modifyColumn('spoc_name', "VARCHAR(255) DEFAULT ''");

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
