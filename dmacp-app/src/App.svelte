<script>
import Visualization from './components/Visualization.svelte';
import { onMount } from "svelte";
import loadData from './loadData.js';
	// import { init } from 'svelte/internal';
	
	export let essayData = [];
	let promise = loadData("./static/data/combustion.html");
	const error = 'uh oh!'
	onMount(async () => {
		essayData = await loadData("./static/data/combustion.html")
	})
</script>

<main>
	<div>
		{#await promise}
			<p>Loading</p>
		{:then data}
			<Visualization data='{ data }' />
		{:catch error}
			<p>{ error }</p>
		{/await}
		<!-- <h1 class='main-title'>Combustion Essay</h1>
		{#each essayData as narration, n}
			<h1 class='narration-header'>Narration { n }</h1>
			<div class='entity'>
				{#each narration as entity, e}
						<div class='entity-specs { entity.type }'>
							<div>{ entity.resource }, {entity.type}</div>
						{#each entity.entityTimePosition as point, p}
							<div class='entity-information'>
								<p class='info'>{ point.x } , { point.y }</p>
								<p class='info'>{ point.label }</p>
							</div>
						{/each}
						</div>
				{/each}
			</div>
		{/each} -->
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		width: 90%;
		margin: 0 auto;
	}

	h1 {
		color: red;
		font-size: 2em;
		font-weight: 100;
	}

	.main-title {
		color: black;
	}

	.narration-header{
		border-top: 1px solid red;
		padding-top: 20px;
	}

	.entity {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.entity-specs {
		min-width: 20%;
		margin: 2% 1%;
		padding: 5px 10px;
		border-radius: 10px;
		
	}

	.interval {
		background-color: rgb(229, 223, 255);
		border: 1px solid blue;
	}

	.instant {
		background-color: rgb(255, 223, 164);
		border: 1px solid rgb(158, 103, 19);
	}

	.entity-information {
		margin: 0 2%;
	}

	.info {
		display: inline-flex;
		font-size: 12px;
		padding: 2px 5px;
		border: 1px solid blue;
		border-radius: 5px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>