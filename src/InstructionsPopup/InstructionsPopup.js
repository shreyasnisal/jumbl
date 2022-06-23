import {useState, useEffect} from 'react'
import './InstructionsPopup.css'
import {FaWindowClose} from 'react-icons/fa'
import {isMobile} from 'react-device-detect'

export default function InstructionsPopup(props) {
	const {onClose} = props

	return (
		<div className = "Instructions-Popup">
			<button className = "Close-Btn" onClick={onClose}>
				<FaWindowClose color = {"#fff"} size = {24} />
			</button>
			<div>
				<h3>Instructions</h3>
			</div>
			<div className = "Instructions">
				<p>Complete the Worteen by rearranging the tiles.</p>
				<p>Each row must be a word.</p>
				<p>Tiles turn green when a row is a word.</p>
				{isMobile ?
					<p>Tap on a tile or swipe anywhere on the board to move tiles.</p> :
					<p>Use Arrow Keys (&larr; &uarr; &rarr; &darr;) or click on the tiles to move them.</p>
				}
			</div>
		</div>
	)
}