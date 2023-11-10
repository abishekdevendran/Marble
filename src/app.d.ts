// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="lucia" />
import 'unplugin-icons/types/svelte';
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface Error {}
		// interface Locals {}
		interface PageData {
			flash?: { type: 'success' | 'error'; message: string };
		}
		interface Platform {
			env: {
				COUNTER: DurableObjectNamespace;
			};
			context: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
	}
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			github_username: string | null;
			username: string | null;
			email: string | null;
			name: string | null;
			avatar: string | null;
		};
		// eslint-disable-next-line @typescript-eslint/ban-types
		type DatabaseSessionAttributes = {};
	}
}

export {};
