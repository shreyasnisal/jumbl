import "./Board.css"
import Tile from "../Tile/Tile.js"
import { BOARD_SIZE, GRID_SIZE } from "../common/constants"


export default function Board(props) {

	const {tiles, correctTiles, handleTileClick} = props

	const tileDimension = BOARD_SIZE / GRID_SIZE

	return (
		<div style = {{height: BOARD_SIZE, width: BOARD_SIZE}} className = "Board">
			{tiles.map((value, index) => (
				<Tile
					key = {index}
					value = {value}
					index = {index}
					width = {tileDimension}
					height = {tileDimension}
					isGreen = {correctTiles[index]}
					handleTileClick = {handleTileClick}
				/>
			))}
			
		</div>
	)
}
