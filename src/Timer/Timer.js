import { useEffect, useState } from "react";
import './Timer.css'
import {MdTimer} from 'react-icons/md'

export default function Timer(props) {
	
	const {time} = props

	return (
		<div className = "Timer">
			<MdTimer size = {20} color = {"#fff"} />
			<p>{Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)}</p>
		</div>
	)
}