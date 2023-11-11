// src/lib/server/lucia.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { libsqlClient } from '$lib/server/db';
import { github, google } from '@lucia-auth/oauth/providers';
import {
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	SELF_URL
} from '$env/static/private';

// expect error (see next section)
export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: libsql(libsqlClient, {
		user: 'user',
		key: 'user_key',
		session: 'user_session'
	}),
	getUserAttributes: (data) => {
		return {
			githubUsername: data.github_username,
			username: data.username,
			email: data.email,
			name: data.name,
			avatar: data.avatar,
			userId: data.id
		};
	}
});

export const githubAuth = github(auth, {
	clientId: GITHUB_CLIENT_ID,
	clientSecret: GITHUB_CLIENT_SECRET
});

export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: SELF_URL + '/auth/google/callback',
	scope: ['email', 'profile']
});

export type Auth = typeof auth;
