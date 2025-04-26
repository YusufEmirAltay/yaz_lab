
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'akademik_portal',
  password: 'Gizem.123',
  port: 5432,
});

module.exports = pool;
