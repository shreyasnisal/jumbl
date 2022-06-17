import './Tile.css'
import {GRID_SIZE} from '../common/constants'
import { getMatrixPosition, getVisualPosition } from '../common/helper'

export default function Tile(props) {
	const { value, index, width, height, isGreen, handleTileClick } = props

	const {row, col} = getMatrixPosition(index)
	const tileVisualPosition = getVisualPosition(row, col, width, height)

	const tileStyle = {
		width: `calc(100% / ${GRID_SIZE})`,
		height: `calc(100% / ${GRID_SIZE})`,
		translateX: tileVisualPosition.x,
		translateY: tileVisualPosition.y
	}

	return (
		<div
			style = {{
				height: tileStyle.height,
				width: tileStyle.width,
				transform: `translate3d(${tileStyle.translateX}px, ${tileStyle.translateY}px, 0)`,
				opacity: value == 0 ? 0 : 1,
				backgroundColor: isGreen ? "#538d4e" : null
			}}
			className = "Tile"
			onClick = {() => handleTileClick(index)}
		>
			<h3>{value}</h3>
		</div>
	)
}
