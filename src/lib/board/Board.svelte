<script lang="ts">
	import { capture, getInitialSetup, moveFilter, type Piece as PieceType } from "./pieces";
	import Piece from "./Piece.svelte";

	import { Vector } from "$lib/vectorMath";
	import Tile from "./Tile.svelte";
	import { fade } from "svelte/transition";

	export let size: number = 5

	let playing: 'white' | 'black' = 'white'
	const changeColor = (p: 'white' | 'black') => p === 'white' ? 'black' : 'white'

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

	function select(piece: PieceType) {
		if (selectedPiece === piece) {
			selectedPiece = null
		} else {
			selectedPiece = piece
		}
	}

	function tryMove(position: Vector) {
		if (!selectedPiece || !canMove(position)) {
			return			
		}

		selectedPiece.position = position
		selectedPiece = null
		capture(position, pieces[changeColor(playing)])
		pieces = pieces
	}	
</script>

<svg viewBox="-10 -10 20 20">
	<g id=tiles>
		{#each positions as position}
			<Tile {position} on:click={() => selectedPiece = null}/>
		{/each}	
	</g>

	{#key selectedPiece}
		<g id=indicators >
		{#each positions.filter(canMove) as position}
			{@const duration = selectedPiece ? Math.sqrt((selectedPiece.position.x - position.x)**2 + (selectedPiece.position.x - position.x)**2) * 20 + 20 : 100}
			<g class='indicator' transition:fade={{ duration }}>
				<Tile {position} on:click={() => tryMove(position)}/>
			</g>
		{/each}	
		</g>
	{/key}

	<g id=pieces>
		<g id=player>
			{#each pieces.white as piece}
				<Piece color="white" {piece} on:click={() => select(piece)}/>
			{/each}
		</g>

		<g id=opponent>
			{#each pieces.black as piece}	
				<Piece color="black" {piece} on:click={() => select(piece)}/>
			{/each}
		</g>
	</g>
</svg>

<style>
	svg {
		height: 95vh;
	}

	#indicators {
		cursor: pointer;
		filter: hue-rotate(60deg) brightness(110%) drop-shadow(0 0 0.1px hsla(250, 60%, 50%, 0.3));
	}

	#opponent {
		pointer-events: none;
	}

	.indicator {
		transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 100ms;
	}

	.indicator:hover {
		filter: brightness(110%);
	}
</style>
