const {Pool, Client} = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'harshitadandu',
  password: 'root',
  port: 5432,
  database: 'sdc'
});


module.exports = pool;