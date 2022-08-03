<script lang="ts">
	import { hexToCart } from "$lib/vectorMath";
	import { urls, type Piece } from "./pieces";	

	export let piece: Piece
	export let color: 'black' | 'white'

	$: coord = hexToCart(piece.position)

	const size = 1.4

	// let held = false

	// let mousePos = [0, 0]
	// let image: SVGImageElement
	// $: rect = image?.getBoundingClientRect() || {x: 0, y: 0}
	// $: delta = [rect.x - mousePos[0], rect.y - mousePos[1]]

	// $: console.log(delta);
	
</script>

<!-- <svelte:window onmousemove={e => {
	if (held) {
		mousePos = [
			e.clientX,
			e.clientY,
		]
	}
}}/> -->

<image x={coord.x - size/2} y={coord.y - size/2} width={size}
href={urls[color][piece.type]} 
on:click
/>
<!-- on:mousedown={() => held = true} on:mouseup={() => held = false} -->

<style>
	image {
		cursor: pointer;
		transition: cubic-bezier(0.445, 0.05, 0.55, 0.95) 70ms;
	}
</style>