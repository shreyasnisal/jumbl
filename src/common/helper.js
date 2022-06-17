import {GRID_SIZE} from './constants'

export function getMatrixPosition(index) {
	return {
		row: Math.floor(index / GRID_SIZE),
		col: index % GRID_SIZE
	}
}

export function getVisualPosition(row, col, width, height) {
	return {
		x: col * width,
		y: row * height
	}
}

export function canSwap(src, dest, GRID_SIZE) {
	const {row: srcRow, col: srcCol} = getMatrixPosition(src, GRID_SIZE)
	const {row: destRow, col: destCol} = getMatrixPosition(dest, GRID_SIZE)
	return Math.abs(srcRow - destRow) + Math.abs(srcCol - destCol) === 1
}

export function swap(tiles, src, dest) {
	const tilesResult = [...tiles];
	[tilesResult[src], tilesResult[dest]] = [tilesResult[dest], tilesResult[src]]
	return tilesResult
}