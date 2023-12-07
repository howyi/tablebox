import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2";
import config from "../drizzle.config";

// migrationsを使った運用はしていないため未使用
async function main() {
    const connection = createConnection({
        uri: config.dbCredentials.connectionString
    })
    const db = drizzle(connection);

    console.log('Running migrations')

    await migrate(db, { migrationsFolder: "./app/_db/migrations" })

    console.log('Migrated successfully')

    process.exit(0)
}

main().catch((e) => {
    console.error('Migration failed')
    console.error(e)
    process.exit(1)
});
