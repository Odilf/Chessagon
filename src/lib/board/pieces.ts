import { equals, sum, Vector } from "$lib/vectors";

export type Type = 'pawn'
				 | 'bishop'
				 | 'knight'
				 | 'rook'
				 | 'queen'
				 | 'king'



export interface Piece {
	position: Vector
	type: Type
}

function piece(type: Type, x: number, y: number): Piece { 
	return { type, position: new Vector(x, y) }
}

const initialSetup = [
	...[...Array(5).keys()].map(i => piece('pawn', 1, i + 1)),
	...[...Array(4).keys()].map(i => piece('pawn', i + 2, 1)),

	piece('rook', 5, 2),
	piece('rook', 2, 5),

	piece('knight', 5, 3),
	piece('knight', 3, 5),

	piece('bishop', 3, 3),
	piece('bishop', 4, 4),
	piece('bishop', 5, 5),

	piece('queen', 5, 4), 
	piece('king', 4, 5),
]

export function getInitialSetup() {
	return {
		white: [...initialSetup],
		black: [
			...initialSetup.slice(0, 16), 
			piece('king', 5, 4), 
			piece('queen', 4, 5)
		].map(p => piece(p.type, -p.position.x, -p.position.y)),
	}
}


type MoveFilter = (position: Vector) => boolean

export function moveFilter(piece: Piece | null, pieces: { white: Piece[], black: Piece[] }, playing: 'white' | 'black'): MoveFilter  {
	if (piece === null) {
		return position => false
	}

	const isOnPiece: MoveFilter = position => {
		return pieces[playing].some(piece => piece.position.x == position.x && piece.position.y == position.y)
	}

	switch (piece.type) {
		case 'bishop': {
			const m = piece.position.x + piece.position.y
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const dif = sum(piece.position, position.scale(-1))
				
				return position.x + position.y === m
				|| dif.x / dif.y === 2
				|| dif.y / dif.x === 2
			}
		}

		case 'rook': {
			const dif = piece.position.x - piece.position.y
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				return piece.position.x === position.x 
					|| piece.position.y === position.y
					|| position.x - position.y === dif
			}
		}

		case 'queen': {
			const rookFilter = moveFilter({ type: 'rook', position: piece.position }, pieces, playing)
			const bishopFilter = moveFilter({ type: 'bishop', position: piece.position }, pieces, playing)
			return position => rookFilter(position) || bishopFilter(position)
		}

		case 'pawn': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const order = playing === 'white' ? 1 : -1
				const dx = (piece.position.x - position.x) * order
				const dy = (piece.position.y - position.y) * order

				const isStartingPosition = piece.position.x == 1 || piece.position.y == 1

				if (isStartingPosition) {
					return (dx == 1 && dy == 1) || (dx == 2 && dy == 2)
				} else {
					return dx == 1 && dy == 1
				}
			}
		}

		case 'knight': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}
				
				const dx = piece.position.x - position.x
				const dy = piece.position.y - position.y
				return knight_moves.some(move => move.x === dx && move.y === dy)
			}
		}

		case 'king': {
			return position => {
				if (isOnPiece(position)) {
					return false
				}

				const dx = Math.abs(piece.position.x - position.x)
				const dy = Math.abs(piece.position.y - position.y)

				return dx + dy < 3 && !(dx === 0 && dy === 2) && !(dx === 2 && dy === 0)
			}
		}
	
		default:
			// return moveFilter(null, pieces, playing)
			throw new Error("Caca");
	}
}

const knight_moves = [
	new Vector(3, 1), new Vector(3, 2),
	new Vector(1, 3), new Vector(2, 3),
	new Vector(-1, 2), new Vector(-2, 1),

	new Vector(-3, -1), new Vector(-3, -2),
	new Vector(-1, -3), new Vector(-2, -3),
	new Vector(1, -2), new Vector(2, -1),
]

export function capture(position: Vector, opponent_pieces: Piece[]) {
	const index = opponent_pieces.findIndex(piece => equals(position, piece.position))

	if (index === -1) {
		return false
	} else {
		opponent_pieces.splice(index, 1)
		return true
	}
}