import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	const session = await event.locals.auth.validate();
	return {
		user: session?.user ?? null
	};
});
