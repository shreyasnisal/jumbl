import {useState, useEffect} from 'react'
import './CompletedPopup.css'
import {FaShareAlt, FaWindowClose} from 'react-icons/fa'
import {MdClear} from 'react-icons/md'

const LAUNCH_DATE = "2022-06-27"

export default function CompletedPopup(props) {

	const {time, moves, onClose} = props

	const [currentStreak, setCurrentStreak] = useState(0)
	const [maximumStreak, setMaximumStreak] = useState(0)
	const [averageTime, setAverageTime] = useState(0)
	const [averageMoves, setAverageMoves] = useState(0)
	const [gamesPlayed, setGamesPlayed] = useState(1)
	const [gamesCompleted, setGamesCompleted] = useState(1)
	const [jumblNumber, setJumblNumber] = useState(1)

	const [showCopiedToast, setShowCopiedToast] = useState(false)
	
	// time to next jumbl
	const [hoursToNextJumbl, setHoursToNextJumbl] = useState(0)
	const [minutesToNextJumbl, setMinutesToNextJumbl] = useState(0)
	const [secondsToNextJumbl, setSecondsToNextJumbl] = useState(0)

	useEffect(() => {
		setCurrentStreak(localStorage.getItem("CurrentStreak") ? JSON.parse(localStorage.getItem("CurrentStreak")) : 1)
		setMaximumStreak(localStorage.getItem("MaximumStreak") ? JSON.parse(localStorage.getItem("MaximumStreak")) : 1)
		setAverageTime(localStorage.getItem("AverageTime") ? JSON.parse(localStorage.getItem("AverageTime")) : time)
		setAverageMoves(localStorage.getItem("AverageMoves") ? JSON.parse(localStorage.getItem("AverageMoves")) : moves)
		setGamesPlayed(localStorage.getItem("GamesPlayed") ? JSON.parse(localStorage.getItem("GamesPlayed")) : 1)
		setGamesCompleted(localStorage.getItem("GamesCompleted") ? JSON.parse(localStorage.getItem("GamesCompleted")) : 1)

		// set jumbl number from launch date
		const launchDate = new Date(LAUNCH_DATE)
		const today = new Date()

		setJumblNumber(today.getDate() - launchDate.getUTCDate() + 1)
	}, [time, moves])

	const share = async () => {
		let success = false
		const timeStr = Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)
		const moveStr = moves.toString()
		if ('clipboard' in navigator) {
			success = await navigator.clipboard.writeText(
				"Jumbl " + jumblNumber +  " " + String.fromCharCode(9989) + "\n" +
				String.fromCharCode(9201) + timeStr + "\n" +
				String.fromCharCode(11014) + " " + String.fromCharCode(11015) + " " + moveStr
			);
		}
		else {
			success = document.execCommand('copy', true,
				"Jumbl " + jumblNumber + " " + String.fromCharCode(9989) + "\n" +
				String.fromCharCode(9201) + timeStr + "\n" +
				String.fromCharCode(11014) + " " + String.fromCharCode(11015) + " " + moveStr
			);
		}

		setShowCopiedToast(true)
		setTimeout(() => setShowCopiedToast(false), 1000)
	}

	useEffect(() => {
		const nextTime = new Date()
		nextTime.setHours(24, 0, 0, 0)
		const interval = setInterval(() => {
			const now = new Date()
			const timeToNext = nextTime.getTime() - now.getTime()

			const h = Math.floor((timeToNext % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			setHoursToNextJumbl(h)

			const m = Math.floor((timeToNext % (1000 * 60 * 60)) / (1000 * 60))
			setMinutesToNextJumbl(m)

			const s = Math.floor((timeToNext % (1000 * 60)) / (1000))
			setSecondsToNextJumbl(s)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className = "Completed-Popup">
			{showCopiedToast && 
				<div className = "Toast">
					<p>Copied to Clipboard</p>
				</div>
			}
			<button className = "Close-Btn" onClick={onClose}>
				<MdClear color = {"#fff"} size = {24} />
			</button>
			<h3>Jumbl {jumblNumber}</h3>
			<div className = "Row">
				<div className = "Column">
					<p className = "Value">{Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)}</p>
					<p className = "Label">Time</p>
				</div>
				<div className = "Column">
					<p className = "Value">{moves}</p>
					<p className = "Label">Moves</p>
				</div>
			</div>
			<div className = "Row">
				<div className = "Column">
					<p className = "Value">{Math.floor(averageTime / 60) + ":" + (averageTime % 60 < 10 ? "0" : "") + (averageTime % 60)}</p>
					<p className = "Label">Average Time</p>
				</div>
				<div className = "Column">
					<p className = "Value">{averageMoves}</p>
					<p className = "Label">Average Moves</p>
				</div>
				<div className = "Column">
					<p className = "Value">{Math.round(gamesCompleted / gamesPlayed * 100)}</p>
					<p className = "Label">Completion %</p>
				</div>
			</div>
			<div className = "Row">
				<div className = "Column">
					<p className = "Value">{gamesPlayed}</p>
					<p className = "Label">Played</p>
				</div>
				<div className = "Column">
					<p className = "Value">{currentStreak}</p>
					<p className = "Label">Current Streak</p>
				</div>
				<div className = "Column">
					<p className = "Value">{maximumStreak}</p>
					<p className = "Label">Maximum Streak</p>
				</div>
			</div>

			<div className = "Row">
				<button className = "Share-Btn" onClick={share}>
					<FaShareAlt color = {"#fff"} size = {20} />	
					<p>Share</p>
				</button>
			</div>

			<div className = "Row No-Margin">
				<h3 className = "Next-Jumbl-Label">Next Jumbl</h3>
			</div>
			<div className = "Row">
				{(secondsToNextJumbl != 0 || minutesToNextJumbl != 0 || hoursToNextJumbl != 0) &&
					<p className = "Next-Jumbl-Timer">
						{hoursToNextJumbl}:{(minutesToNextJumbl < 10 ? "0" : "")}{minutesToNextJumbl}:{secondsToNextJumbl < 10 ? "0" : ""}{secondsToNextJumbl}
					</p>
				}
			</div>
		</div>
	)
}