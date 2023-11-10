<script>
	import { page } from '$app/stores';
	import { dev, browser } from '$app/environment';
	import '../app.postcss';
	import Nav from '$lib/components/nav/index.svelte';
	import TailwindIndicator from '$lib/components/tailwind-indicator.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '@fontsource/poppins';
</script>

<ModeWatcher />
<svelte:head>
	<title>Marble | Home</title>
</svelte:head>
<div class="font-poppins relative flex min-h-screen flex-col" id="page">
	<Nav />
	<div class="flex-1">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
