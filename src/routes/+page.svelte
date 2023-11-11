<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import BasilGoogleSolid from '~icons/basil/google-solid';
	import BiGithub from '~icons/bi/github';
	import { superForm as sf } from 'sveltekit-superforms/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import IcBaselineDeleteForever from '~icons/ic/baseline-delete-forever';
	import { dev } from '$app/environment';

	export let data;
	const { form: superForm, enhance: superEnhance } = sf(data.form, {
		multipleSubmits: 'prevent'
	});
</script>

<main class="flex flex-1 flex-col items-center justify-center gap-6 py-6">
	<h1 class="mt-36 scroll-m-20 font-quantify text-4xl font-extrabold tracking-wider lg:text-7xl">
		Be Productive.
	</h1>
	<h2 class="scroll-m-20 text-2xl font-semibold lg:text-4xl">Get Started</h2>
	<div class="flex flex-col items-center justify-center gap-4">
		{#if dev}
			<SuperDebug data={$superForm} />
		{/if}
		<!-- {JSON.stringify(data)} -->
		{#if data.user}
			{#if data.form}
				<form method="POST" use:superEnhance class="flex flex-col" action="?/addTodo">
					<label for="title">Task:</label>
					<input type="text" name="title" bind:value={$superForm.title} />

					<label for="completed">Completed:</label>
					<input type="checkbox" name="completed" bind:checked={$superForm.completed} />

					<div><Button type="submit">Submit</Button></div>
				</form>
			{/if}
			{#await data.streamed.todos}
				<p>Loading todos...</p>
			{:then todos}
				{#if todos?.length}
					<div class="flex w-full flex-col items-center justify-center gap-1 rounded-sm">
						{#each todos as todo}
							<form
								method="post"
								action="?/deleteTodo"
								use:enhance
								class={`flex w-full items-center justify-between gap-1 rounded-sm ${
								todo.completed===1 ? 'line-through' : ''}`}
							>
								<input type="hidden" name="id" value={todo.id} />
								<Button type="submit" class="w-full" formaction="?/toggleTodo">
									{todo.title}
								</Button>
								<Button type="submit">
									<IcBaselineDeleteForever />
								</Button>
							</form>
						{/each}
					</div>
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
