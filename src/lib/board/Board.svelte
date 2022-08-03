<script lang="ts">
	import { getInitialSetup, moveFilter, type Piece as PieceType } from "./pieces";
	import Piece from "./Piece.svelte";

	import { Vector } from "$lib/vectorMath";
	import Indicator from "./Indicator.svelte";
	import Tile from "./Tile.svelte";

	export let size: number = 5

	function createBoard(size: number) {
		let c: Vector[] = []

		for (let i = -size; i <= size; i++) {
			for (let j = -size; j <= size; j++) {
				if (Math.abs(i - j) <= size) {
					c.push(new Vector(i, j))
				}
			}
		}
		
		return c
	}

	const positions = createBoard(size)
	let pieces = getInitialSetup()

	let selectedPiece: PieceType | null = null
	$: canMove = moveFilter(selectedPiece, pieces, 'white')

	function tryMove(position: Vector) {
		if (!selectedPiece || !canMove(position)) {
			return
		}

		selectedPiece.position = position
		pieces = pieces
		selectedPiece = null
	}
</script>

<svg viewBox="-10 -10 20 20">
	<g id=board>
		{#each positions as position}
			{#if selectedPiece && canMove(position)}
				<g class='clickable'>
					<Tile {position} on:click={() => tryMove(position)}/>
				</g>
			
				{@const distance = (selectedPiece.position.x - position.x) ** 2 + (selectedPiece.position.y - position.y) ** 2}
				<Indicator {position} inDuration={distance * 5 + 100}/>
			{:else}
				<Tile {position} on:click={() => selectedPiece = null}/>
			{/if}
		{/each}	
	</g>

	<g id=pieces>
		<g id=white>
			{#each pieces.white as piece}	
				<Piece color="white" {piece} on:click={() => selectedPiece = piece}/>
			{/each}
		</g>

		<g id=black>
			{#each pieces.black as piece}	
				<Piece color="black" {piece} on:click={() => selectedPiece = piece}/>
			{/each}
		</g>
	</g>

	<!-- <Piece color="white" piece={{ type: 'bishop', position: new Vector(0, 0)}}/> -->
</svg>

<style>
	svg {
		height: 95vh;
	}

	.clickable {
		cursor: pointer;
	}
</style>
