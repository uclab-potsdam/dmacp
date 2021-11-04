<script>
	import { pointers } from "d3-selection";
import { onMount } from "svelte";
	import loadData from './loadData.js';
	// import { init } from 'svelte/internal';
	
	let essayData = [];
	onMount(async () => {
		essayData = await loadData("./static/data/combustion.html")
	})
</script>

<main>
	<!-- <h1>Hello!</h1> -->
	<div>
		{#each essayData as narration, n}
			<h1 class='narration-header'>Narration { n }</h1>
			<div class='entity'>
				{#each narration as entity, e}
						<div class='entity-specs'>
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
		{/each}
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
		color: blue;
		font-size: 2em;
		font-weight: 100;
	}

	.narration-header{
		border-top: 1px solid blue;
		padding-top: 20px;
	}

	.entity {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
	}

	.entity-specs {
		min-width: 20%;
		border: 1px solid blue;
		margin: 2% 1%;
		padding: 5px 10px;
		border-radius: 10px;
		background-color: rgb(229, 223, 255);
		
	}

	.entity-information {
		margin: 5% 2%;
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