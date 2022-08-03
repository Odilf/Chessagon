export class Vector {
	x: number
	y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	scale(scalar: number): Vector {
		return new Vector(this.x * scalar, this.y * scalar)
	}
}

export const alpha = 2*Math.PI / 6
export const hexBase = {
	x: new Vector(Math.cos(Math.PI - alpha/2), Math.sin(Math.PI - alpha/2)).scale(1.5/Math.cos(alpha/2)),
	y: new Vector(Math.cos(alpha/2), Math.sin(alpha / 2)).scale(1.5/Math.cos(alpha/2)),
}

export const hexagonPoints = [
	new Vector(1,     0),
	new Vector(0.5,   0.866),
	new Vector(-0.5,  0.866),
	new Vector(-1,    0),
	new Vector(-0.5,  -0.866),
	new Vector(0.5, -0.866),
]

export const directions = [
	new Vector(1, 0),
	new Vector(1, 1),
	new Vector(0, 1),
	new Vector(0, -1),
	new Vector(-1, -1),
	new Vector(-1, 0),
]

export function sum(a: Vector, b: Vector): Vector {
	return new Vector(a.x + b.x, a.y + b.y)
}

export function hexToCart(hex: Vector): Vector {
	return sum(hexBase.x.scale(hex.x), hexBase.y.scale(hex.y))
}

export function equals(a: Vector, b: Vector) {
	return a.x === b.x && a.y === b.y
}