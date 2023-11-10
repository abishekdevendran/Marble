import { db } from '$lib/server/db.js';
import { auth, githubAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	console.log('github callback');
	const storedState = cookies.get('github_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);
		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			// if email already exists return 400
			const existingDatabaseUserWithEmail = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.email, githubUser.email!)
			});
			if (existingDatabaseUserWithEmail) {
				throw new Error('Email already exists');
			}
			const user = await createUser({
				attributes: {
					github_username: githubUser.login,
					email: githubUser.email,
					username: githubUser.login,
					name: githubUser.name,
					avatar: githubUser.avatar_url ?? null
				}
			});
			return user;
		};
		const user = await getUser();
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		locals.auth.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		console.error(e);
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		if (e instanceof Error) {
			return new Response(e.message, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
