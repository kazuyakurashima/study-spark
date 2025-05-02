
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment variables');
  process.exit(1);
}

async function setupDatabase() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // Required for Supabase connections
    }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database');

    console.log('Reading SQL file...');
    const sqlFilePath = path.join(__dirname, 'setup-supabase-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        await client.query(statement + ';');
        console.log(`Statement ${i + 1} executed successfully`);
      } catch (err) {
        console.error(`Error executing statement ${i + 1}:`, err);
      }
    }

    console.log('Database setup completed');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

setupDatabase();
