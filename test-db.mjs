import { connect } from '@tidbcloud/serverless';

const config = {
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'sys',
};

async function main() {
  try {
    const db = connect(config);
    const result = await db.execute('SELECT * FROM licenses');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
main();
