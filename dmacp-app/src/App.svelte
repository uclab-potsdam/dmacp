<script>
	import * as d3 from 'd3';
	import { onMount } from "svelte";
	
	let essayData = [];
	onMount(async () => {
		const data = await d3.html("./static/data/combustion.html").then(function (essay) {

			essay = [].map.call(essay.querySelectorAll("p"), (narration) => {

				narration = [].map.call(narration.querySelectorAll("span"), (entity) => {
					return entity
				})
				return narration
			})
			return essay
		});
		essayData = data
	})
</script>

<main>
	<h1>Hello!</h1>
	<p>{ essayData }</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>