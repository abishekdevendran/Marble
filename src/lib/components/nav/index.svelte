<script lang="ts">
	import DarkToggle from '$lib/components/nav/dark-toggle.svelte';
</script>

<div class="border-b">
	<div
		class="container flex-1 grid grid-cols-[220px_minmax(0,1fr)] items-center md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
	>
		<h1 class="my-2 scroll-m-20 font-quantify text-4xl font-extrabold tracking-widest lg:text-5xl">
			MARBLE
		</h1>
		<div class="flex h-full w-full items-center justify-end md:py-2">
			<DarkToggle />
		</div>
	</div>
</div>
