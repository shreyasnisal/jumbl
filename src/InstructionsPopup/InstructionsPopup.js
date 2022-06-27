import {useState, useEffect} from 'react'
import './InstructionsPopup.css'
import {FaWindowClose} from 'react-icons/fa'
import {MdClear} from 'react-icons/md'
import {isMobile} from 'react-device-detect'
import exampleImage from '../common/images/example.png'

export default function InstructionsPopup(props) {
	const {onClose} = props

	return (
		<div className = "Instructions-Popup">
			<button className = "Close-Btn" onClick={onClose}>
				<MdClear color = {"#fff"} size = {24} />
			</button>
			<div>
				<h3>Instructions</h3>
			</div>
			<div className = "Instructions">
				<p>Complete the Jumbl by rearranging the tiles.</p>
				<p>Each row must be a word.</p>
				<p>Tiles turn green when a row is a word.</p>
				<p>There are several possible combinations. Just because tiles turn green doesn't mean they are in the only correct place.</p>
				{isMobile ?
					<p>Tap on a tile or swipe anywhere on the board to move tiles.</p> :
					<p>Use Arrow Keys (&larr; &uarr; &rarr; &darr;) or click on the tiles to move them.</p>
				}
				<hr />
				<h5>Example</h5>
				<img src = {exampleImage} width = "200px" height = "200px" />
			</div>
		</div>
	)
}