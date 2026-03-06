const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrationFiles = [
    '001_create_users.sql',
    '002_create_coach_profiles.sql',
    '003_create_coaching_requests.sql',
    '004_create_availability_blocks.sql',
];

async function runMigrations() {
    const client = await pool.connect();
    try {
        for (const file of migrationFiles) {
            const filePath = path.join(__dirname, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            console.log(`Running migration: ${file}...`);
            await client.query(sql);
            console.log(`  ✅ ${file} completed.`);
        }
        console.log('\n🎉 All migrations ran successfully.');
    } catch (err) {
        console.error('\n❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
