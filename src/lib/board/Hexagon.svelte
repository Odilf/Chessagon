<script lang="ts">
	import { coordsToSVGString } from "$lib/utils";
	import { alpha, hexagonPoints, hexToCart, sum, Vector,  } from "$lib/vectors";	

	export let position: Vector
	export let r = 1
	export let color: {h: number, s: number, l: number}

	$: cartCoords = hexToCart(position)
	$: points = coordsToSVGString(hexagonPoints.map(p => sum(p.scale(r), cartCoords)))

	$: fill = `hsl(${color.h}, ${color.s}%, ${color.l}%`
</script>

<polygon name="hexagon" {points} {fill} on:click />

<style>
	polygon {
		transition: cubic-bezier(0.77, 0, 0.175, 1) 100ms
	}

	polygon:active {
		filter: brightness(90%);
	}
</style>