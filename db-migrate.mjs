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
    console.log('Adding column name to licenses...');
    await db.execute('ALTER TABLE licenses ADD COLUMN name VARCHAR(255) NULL AFTER id;');
    console.log('Done!');
  } catch (error) {
    // Ignore error if column already exists
    console.error('Error (might already exist):', error.message);
  }
}
main();
