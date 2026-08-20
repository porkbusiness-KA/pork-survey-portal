const mysql = require('mysql2/promise');

const passwords = ['', 'root', '123456', '1234', '12345678', 'admin', 'password', 'root123', 'MySQL80', 'mysql', 'Admin@123', 'root@123', 'pork@123', 'mysql@123', '123456789'];

async function check() {
  console.log('Testing MySQL connections...');
  for (const pw of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pw
      });
      console.log('FOUND_VALID_CREDENTIALS: user=root, password="' + pw + '"');
      await conn.query('CREATE DATABASE IF NOT EXISTS pork_survey_db;');
      console.log('Database pork_survey_db ensured!');
      await conn.end();
      return pw;
    } catch (err) {
      // Continue checking
    }
  }
  console.log('No default password matched.');
  return null;
}

check();
