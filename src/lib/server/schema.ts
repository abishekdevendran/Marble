// schema.js
import { sqliteTable, text, blob } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	// other user attributes
	github_username: text('github_username').unique(),
	username: text('username').unique(),
	name: text('name'),
	email: text('email').unique(),
	avatar: text('avatar')
});

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint'
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint'
	}).notNull()
});

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password')
});

export const todos = sqliteTable('todos', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	title: text('title'),
	completed: text('completed')
});
