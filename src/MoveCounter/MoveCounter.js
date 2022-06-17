import './MoveCounter.css'

export default function MoveCounter(props) {
	
	const {moves} = props

	return (
		<div className = "Move-Counter">
			<p>{"Moves: " + moves}</p>
		</div>
	)
}