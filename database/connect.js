const { Client } = require('pg');

module.exports.getClient = async () => {
  const client = new Client({
    host: 'localhost',
    port: '5432',
    user: 'dev',
    password: 'dev',
    database: 'devdb'
  });
  await client.connect();
  return client;
};
