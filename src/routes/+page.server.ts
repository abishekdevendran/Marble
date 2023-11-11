import { db } from '$lib/server/db.js';
import { auth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import type { Session } from 'lucia';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

const todosPromise = async (session: Session) => {
	try {
		const todos = await db.query.todos.findMany({
			where: (todos, { eq }) => eq(todos.userId, session.user.userId)
		});
		return todos;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const load = async (event) => {
	const session = await event.locals.auth.validate();
	console.log(session);
	if (!session) {
		return {
			streamed: {
				todos: null
			}
		};
	}
	return {
		streamed: {
			todos: todosPromise(session)
		}
	};
};

export const actions = {
	logout: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) {
			setFlash(
				{
					type: 'error',
					message: 'You are not logged in.'
				},
				event
			);
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
