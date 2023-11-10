<script>
	import { page } from '$app/stores';
	import { dev, browser } from '$app/environment';
	import '../app.postcss';
	import Nav from '$lib/components/nav/index.svelte';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '@fontsource/poppins';
	import { Toaster, toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message/client';

	const flash = getFlash(page, {
		clearOnNavigate: true
	});

	$: if ($flash) {
		switch ($flash.type) {
			case 'success':
				toast.success($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
			default:
				toast.info($flash.message);
		}
	}
</script>

<ModeWatcher />
<Toaster />

<svelte:head>
	<title>Marble | Home</title>
</svelte:head>
<div class="relative flex min-h-screen flex-col font-poppins" id="page">
	<Nav />
	<div class="flex-1">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
