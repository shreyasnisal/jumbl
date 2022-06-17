import { useEffect, useState } from "react";
import './Timer.css'

export default function Timer(props) {
	
	const {time} = props

	return (
		<div className = "Timer">
			<p>{Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)}</p>
		</div>
	)
}