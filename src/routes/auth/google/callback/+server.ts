import { db } from '$lib/server/db.js';
import { auth, googleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
	console.log('google callback');
	const storedState = cookies.get('google_oauth_state');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, googleUser, createUser, createKey } =
			await googleAuth.validateCallback(code);

		const getUser = async () => {
			const existingUser = await getExistingUser();
			if (existingUser) return existingUser;
			if (googleUser.email_verified && googleUser.email) {
				// check if user already exists with email
				const existingDatabaseUserWithEmail = await db.query.user.findFirst({
					where: (user, { eq }) => eq(user.email, googleUser.email!)
				});
				if (existingDatabaseUserWithEmail) {
					// transform `UserSchema` to `User`
					const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail);
					await createKey(user.userId);
					return user;
				}
			}
			const user = await createUser({
				attributes: {
					email: googleUser.email ?? null,
					username: null,
					github_username: null,
					name: googleUser.name,
					avatar: googleUser.picture ?? null
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
		if (e instanceof OAuthRequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};
