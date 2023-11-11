import { db } from '$lib/server/db.js';
import { auth } from '$lib/server/lucia';
import { todos } from '$lib/server/schema.js';
import { fail } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { Session } from 'lucia';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

// Name has a default value just to display something in the form.
const schema = z.object({
	title: z.string(),
	completed: z.boolean().default(false)
});

const deleteSchema = z.object({
	id: z.number()
});

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
	const form = await superValidate(schema);
	if (!session) {
		return {
			form,
			streamed: {
				todos: null
			}
		};
	}
	return {
		form,
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
	},
	addTodo: async (event) => {
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
		const form = await superValidate(event.request, schema);
		console.log('POST', form);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		if (!form.data.title || form.data.title.length === 0) {
			setFlash(
				{
					type: 'error',
					message: 'Title is required.'
				},
				event
			);
			return fail(400, { form });
		}
		// insert into todos table using drizzle
		const todo = await db.insert(todos).values({
			title: form.data.title,
			completed: form.data.completed ? 1 : 0,
			userId: session.user.userId
		});

		// Yep, return { form } here too
		return { form };
	},
	deleteTodo: async (event) => {
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
		// parse form into key value pairs
		const form = await event.request.formData();
		const formId: number = parseInt((form.get('id') as string) ?? '-1');
		console.log('POST', formId);
		// Convenient validation check:
		if (formId < 0) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			const todo = await db
				.delete(todos)
				.where(and(eq(todos.id, formId), eq(todos.userId, session.user.userId)));
			console.log(todo);
			// return success
		} catch (e) {
			console.log(e);
			return fail(400);
		}
	},
	toggleTodo: async (event) => {
		console.log('toggle');
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
		// parse form into key value pairs
		const form = await event.request.formData();
		const formId: number = parseInt((form.get('id') as string) ?? '-1');
		console.log('POST', formId);
		// Convenient validation check:
		if (formId < 0) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		try {
			await db.transaction(async (db) => {
				const todo = await db
					.select()
					.from(todos)
					.where(and(eq(todos.id, formId), eq(todos.userId, session.user.userId)))
					.limit(1);
				if (todo && todo.length > 0) {
					await db
						.update(todos)
						.set({
							completed: todo[0].completed ? 0 : 1
						})
						.where(eq(todos.id, formId));
				} else {
					throw new Error('Todo not found');
				}
			});

			// return success
		} catch (e) {
			console.log(e);
			return fail(400);
		}
	}
};
