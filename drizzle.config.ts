import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

export default {
    schema: './app/_db/schema.ts',
    out: './app/_db/migrations',
    driver: 'mysql2',
    dbCredentials: {
        connectionString: process.env.DB_URL as string,

    },
} satisfies Config;
