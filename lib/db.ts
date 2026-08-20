import { connect } from '@tidbcloud/serverless';

if (!process.env.DB_HOST || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  throw new Error('Database configuration missing in environment variables.');
}

const config = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'sys',
};

// Use a singleton connection for edge environments where possible
const db = connect(config);

export default db;
