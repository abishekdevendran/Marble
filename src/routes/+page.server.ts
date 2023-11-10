import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

export const actions = {
	logout: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session){
			setFlash({
				type: 'error',
				message: 'You are not logged in.'
			}, event);
			return fail(401);
		}
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.auth.setSession(null); // remove cookie
		throw redirect(
			302,
			'/',
			{
				type: 'success',
				message: 'You have been logged out successfully.'
			},
			event
		); // redirect to home page
	}
};
