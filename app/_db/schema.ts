import {
    int,
    timestamp,
    mysqlEnum,
    mysqlTable,
    bigint,
    uniqueIndex,
    varchar,
    primaryKey,
    text, datetime, json, index
} from 'drizzle-orm/mysql-core';
import type { AdapterAccount } from "@auth/core/adapters"
import {relations} from "drizzle-orm";
import {Installation} from "@slack/bolt";

export const user_slack_teams = mysqlTable(
    'user_slack_teams',
    {
        id: varchar('id', { length: 255 }).notNull(),
        slackUserId: varchar("slackUserId", { length: 255 }),
    },
(user_slack_team) => ({
    compoundKey: primaryKey(user_slack_team.id, user_slack_team.slackUserId),
}));

export const todos = mysqlTable(
    'todos',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        slackTeamId: varchar("slackTeamId", { length: 255 }),
        createdUserId: varchar("createdUserId", { length: 255 }),
        title: varchar("title", { length: 255 }),
    },
);

export const todosRelations = relations(todos, ({ one }) => ({
    user: one(users, {
        fields: [todos.createdUserId],
        references: [users.id],
    }),
}));

export const bga_team_webhook_settings = mysqlTable(
    'bga_team_webhook_settings',
    {
        teamId: varchar('teamId', { length: 255 }).primaryKey().notNull(),
        slackWebhookUrl: varchar("slackWebhookUrl", { length: 255 }),
    }
)

export const bga_team_notify_settings = mysqlTable(
    'bga_team_notify_settings',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        teamId: varchar('teamId', { length: 255 }).notNull(),
        tableUrl: text('tableUrl').notNull(),
    }
)

export const tablebox_teams = mysqlTable(
    'tablebox_teams',
    {
        id: varchar('id', { length: 255 }).primaryKey().notNull(),
        installation: json('installation').$type<Installation>(),
    },
);

export const cron_job_histories = mysqlTable(
    'cron_job_histories',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        executed_at: datetime("executed_at").notNull(),
    }
)

export const boil_notes = mysqlTable(
    'boil_notes',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        team_id: varchar('team_id', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 24 }).notNull(),
    }
)

export const boil_pages = mysqlTable(
    'boil_pages',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        team_id: varchar('team_id', { length: 255 }).notNull(),
        note_id: bigint('note_id', { mode: 'number' }).notNull(),
        slug: varchar('slug', { length: 24 }).notNull(),
        body_raw: json('body_raw').notNull(),
        body_text: text('body_text').notNull(),
        created_at: datetime("created_at").notNull(),
        updated_at: datetime("updated_at").notNull(),
    }
)

export const boil_rooms = mysqlTable(
    'boil_rooms',
    {
        id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
        team_id: varchar('team_id', { length: 255 }).notNull(),
        note_id: bigint('note_id', { mode: 'number' }).notNull(),
        page_id: bigint('page_id', { mode: 'number' }).notNull(),
        room_id: varchar('room_id', { length: 24 }).notNull(),
        user_id: varchar("user_id", { length: 255 }).notNull(),
        connection_id: bigint("connection_id", { mode: 'number' }).notNull(),
    }
)

export const roomsRelations = relations(boil_rooms, ({ one }) => ({
    user: one(users, {
        fields: [boil_rooms.user_id],
        references: [users.id],
    }),
}));


// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const users = mysqlTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
    image: varchar("image", { length: 255 }),
})

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const accounts = mysqlTable(
    "account",
    {
        userId: varchar("userId", { length: 255 }),
        type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
        refresh_token: varchar("refresh_token", { length: 255 }),
        access_token: varchar("access_token", { length: 255 }),
        expires_at: int("expires_at"),
        token_type: varchar("token_type", { length: 255 }),
        scope: varchar("scope", { length: 255 }),
        id_token: varchar("id_token", { length: 2048 }),
        session_state: varchar("session_state", { length: 255 }),
    },
    (account) => ({
        compoundKey: primaryKey(account.provider, account.providerAccountId),
    })
)

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const sessions = mysqlTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

// Next-Auth 用DB
// https://authjs.dev/reference/adapter/drizzle#mysql
export const verificationTokens = mysqlTable(
    "verificationToken",
    {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey(vt.identifier, vt.token),
    })
)


// memebox tables
// https://github.com/howyi/memebox/blob/main/app/_db/schema.ts
export const teams = mysqlTable(
    'teams',
    {
        id: varchar('id', { length: 255 }).primaryKey().notNull(),
        installation: json('installation'),
    },
);

// memebox tables
// https://github.com/howyi/memebox/blob/main/app/_db/schema.ts
export const memes = mysqlTable(
    'memes',
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        slackTeamId: varchar("slackTeamId", { length: 255 }).notNull(),
        author: text("author"),
        text: text("text"),
        url: varchar("url", { length: 255 }).unique(),
        created_at: datetime("created_at").notNull(),
    },(table) => {
        return {
            teamIdx: index("team_idx").on(table.slackTeamId),
        };
    });
