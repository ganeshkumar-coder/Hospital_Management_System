require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ MySQL connected → database: "${process.env.DB_NAME}" on ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection FAILED:", err.message);
    console.error("👉 Check your .env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME");
    process.exit(1);
  }
})();

module.exports = pool;