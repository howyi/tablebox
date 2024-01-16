import "server-only"

import * as drizzle_mysql from "drizzle-orm/mysql2";
import * as mysql2 from "mysql2";
import * as driizzle_pscale from 'drizzle-orm/planetscale-serverless'
import * as pscale from '@planetscale/database'

import config from "@/drizzle.config";
import * as schema from './schema';

const getDB = () => {
    if (process.env.DB_TYPE == "pscale") {
        const connection = pscale.connect({
            url: config.dbCredentials.connectionString
        })
        return driizzle_pscale.drizzle(connection, { schema });
    } else {
        const connection = mysql2.createConnection({
            uri: config.dbCredentials.connectionString,
            charset: 'utf8mb4',
        })
        return drizzle_mysql.drizzle(connection, { schema, mode: 'default', logger: true });
    }
}

export const  db = getDB()
