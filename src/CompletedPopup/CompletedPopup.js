import {useState, useEffect} from 'react'
import './CompletedPopup.css'
import {FaShareAlt} from 'react-icons/fa'

export default function CompletedPopup(props) {

	const {time, moves} = props

	const [currentStreak, setCurrentStreak] = useState(0)
	const [maximumStreak, setMaximumStreak] = useState(0)
	const [averageTime, setAverageTime] = useState(0)
	const [averageMoves, setAverageMoves] = useState(0)
	const [gamesPlayed, setGamesPlayed] = useState(1)
	const [gamesCompleted, setGamesCompleted] = useState(1)

	const [showCopiedToast, setShowCopiedToast] = useState(false)
	
	// time to next worteen
	const [hoursToNextWorteen, setHoursToNextWorteen] = useState(0)
	const [minutesToNextWorteen, setMinutesToNextWorteen] = useState(0)
	const [secondsToNextWorteen, setSecondsToNextWorteen] = useState(0)

	useEffect(() => {
		setCurrentStreak(localStorage.getItem("CurrentStreak") ? JSON.parse(localStorage.getItem("CurrentStreak")) : 1)
		setMaximumStreak(localStorage.getItem("MaximumStreak") ? JSON.parse(localStorage.getItem("MaximumStreak")) : 1)
		setAverageTime(localStorage.getItem("AverageTime") ? JSON.parse(localStorage.getItem("AverageTime")) : time)
		setAverageMoves(localStorage.getItem("AverageMoves") ? JSON.parse(localStorage.getItem("AverageMoves")) : moves)
		setGamesPlayed(localStorage.getItem("GamesPlayed") ? JSON.parse(localStorage.getItem("GamesPlayed")) : 1)
		setGamesCompleted(localStorage.getItem("GamesCompleted") ? JSON.parse(localStorage.getItem("GamesCompleted")) : 1)
	}, [])

	const share = async () => {
		let success = false
		const timeStr = Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)
		const moveStr = moves.toString()
		if ('clipboard' in navigator) {
			success = await navigator.clipboard.writeText(
				"Worteen 1\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"Time: " + timeStr +
				", Moves: " + moveStr
			);
		}
		else {
			success = document.execCommand('copy', true,
				"Worteen 1\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"\uD83D\uDFE9\uD83D\uDFE9\uD83D\uDFE9\n" +
				"Time: " + timeStr +
				", Moves: " + moveStr
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
			setHoursToNextWorteen(h)

			const m = Math.floor((timeToNext % (1000 * 60 * 60)) / (1000 * 60))
			setMinutesToNextWorteen(m)

			const s = Math.floor((timeToNext % (1000 * 60)) / (1000))
			setSecondsToNextWorteen(s)
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
			<h3>Statistics</h3>
			<div className = "Row">
				<div className = "Column">
					<p className = "Value">{Math.floor(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + (time % 60)}</p>
					<p className = "Label">Time</p>
				</div>
				<div className = "Column">
					<p className = "Value">{Math.floor(averageTime / 60) + ":" + (averageTime % 60 < 10 ? "0" : "") + (averageTime % 60)}</p>
					<p className = "Label">Average Time</p>
				</div>
				<div className = "Column">
					<p className = "Value">{moves}</p>
					<p className = "Label">Moves</p>
				</div>
				<div className = "Column">
					<p className = "Value">{averageMoves}</p>
					<p className = "Label">Average Moves</p>
				</div>
			</div>
			<div className = "Row">
				<div className = "Column">
					<p className = "Value">{gamesPlayed}</p>
					<p className = "Label">Played</p>
				</div>
				<div className = "Column">
					<p className = "Value">{Math.round(gamesCompleted / gamesPlayed * 100)}</p>
					<p className = "Label">Completion %</p>
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
				<h3 className = "Next-Worteen-Label">Next Worteen</h3>
			</div>
			<div className = "Row">
				{secondsToNextWorteen != 0 && minutesToNextWorteen != 0 && hoursToNextWorteen != 0 &&
					<p className = "Next-Worteen-Timer">
						{hoursToNextWorteen}:{(minutesToNextWorteen < 10 ? "0" : "")}{minutesToNextWorteen}:{secondsToNextWorteen < 10 ? "0" : ""}{secondsToNextWorteen}
					</p>
				}
			</div>
		</div>
	)
}