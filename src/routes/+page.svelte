<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import BasilGoogleSolid from '~icons/basil/google-solid';
	import BiGithub from '~icons/bi/github';
	export let data;
</script>

<main class="flex flex-1 flex-col items-center justify-center gap-6 py-6">
	<h1 class="mt-36 scroll-m-20 font-quantify text-4xl font-extrabold tracking-wider lg:text-7xl">
		Be Productive.
	</h1>
	<h2 class="scroll-m-20 text-2xl font-semibold lg:text-4xl">Get Started</h2>
	<div class="flex items-center justify-center gap-4">
		<!-- {JSON.stringify(data)} -->
		{#if data.user}
			{#await data.streamed.todos}
				<p>Loading todos...</p>
			{:then todos}
				{#if todos?.length}
					{#each todos as todo}
						<div class="flex flex-col items-center justify-center gap-2">
							<p>{todo.title}</p>
						</div>
					{/each}
				{:else}
					<p>No todos yet.</p>
				{/if}
			{:catch error}
				<p>{error.message}</p>
			{/await}
			<form method="post" action="?/logout" use:enhance>
				<button
					class="flex transform-gpu items-center justify-center transition-all duration-300 hover:scale-110"
					type="submit"
				>
					Logout
				</button>
			</form>
		{:else}
			<button
				class="flex transform-gpu items-center justify-center transition-all duration-300 hover:scale-110"
				on:click={()=>goto('/auth/google')}
			>
				<BasilGoogleSolid font-size="64" />
			</button>
			<button
				class="flex transform-gpu items-center justify-center transition-all duration-300 hover:scale-110"
				on:click={()=>goto('/auth/github')}
			>
				<BiGithub font-size="64" />
			</button>
		{/if}
	</div>
</main>
