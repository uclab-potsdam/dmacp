<script>
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