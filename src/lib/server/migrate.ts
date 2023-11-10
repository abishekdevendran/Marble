import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
	const db = drizzle(
		createClient({
			url: process.env.DB_URL || '',
			authToken: process.env.DB_KEY || ''
		})
	);

	console.log('Running migrations');
	await migrate(db, { migrationsFolder: 'drizzle' });
	console.log('Migrated successfully');
	process.exit(0);
}

main().catch((e) => {
	console.error('Migration failed');
	console.error(e);
	process.exit(1);
});
