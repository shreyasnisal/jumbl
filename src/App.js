import {useState, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';
import Board from './Board/Board.js'
import Timer from './Timer/Timer.js'
import MoveCounter from './MoveCounter/MoveCounter.js'
import {swap, canSwap} from './common/helper'
import {getTimerRunning, startStopTimer} from './common/helper.js'
import CompletedPopup from './CompletedPopup/CompletedPopup';
import InstructionsPopup from './InstructionsPopup/InstructionsPopup';
import {FaInfoCircle} from 'react-icons/fa'

function App() {

  const [tiles, setTiles] = useState([])
	const [correctTiles, setCorrectTiles] = useState([...Array(0)].keys())
	const [isCompleted, setIsCompleted] = useState(false)
	const [moves, setMoves] = useState(0)
	const [time, setTime] = useState(0)
	const [timerRunning, setTimerRunning] = useState(false)
	const [compliment, setCompliment] = useState("")
  const [swapDisabled, setSwapDisabled] = useState(false)
  const [worteenDate, setWorteenDate] = useState("")
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [gamesCompleted, setGamesCompleted] = useState(0)
  const [maximumStreak, setMaximumStreak] = useState(0)
  const [lastWorteenCompleted, setLastWorteenCompleted] = useState(null)
  const [isCurrentStreak, setIsCurrentStreak] = useState(false)
  const [averageTime, setAverageTime] = useState(0)
  const [averageMoves, setAverageMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {

    // Initialize puzzle
		const fetchData = async () => {
      localStorage.clear()

      if (!localStorage.getItem("GamesPlayed")) {
        setShowInstructions(true)
      }

      const localDate = new Date()
      const dateString = "" + localDate.getFullYear() + "-" + (localDate.getMonth() + 1) + "-" + localDate.getDate()
      setWorteenDate(dateString)

      setGamesCompleted(localStorage.getItem("GamesCompleted") ? JSON.parse(localStorage.getItem("gamesCompleted")) : 0)
      setMaximumStreak(localStorage.getItem("MaximumStreak") ? JSON.parse(localStorage.getItem("MaximumStreak")) : 0)
      setLastWorteenCompleted(localStorage.getItem("LastWorteenCompleted") ? JSON.parse(localStorage.getItem("LastWorteenCompleted")) : null)
      setAverageTime(localStorage.getItem("AverageTime") ? JSON.parse(localStorage.getItem("AverageTime")) : 0)
      setAverageMoves(localStorage.getItem("AverageMoves") ? JSON.parse(localStorage.getItem("AverageMoves")) : 0)

      if (localStorage.getItem(dateString + "tiles")) {
        setTime(JSON.parse(localStorage.getItem(dateString + "time")))
        setMoves(JSON.parse(localStorage.getItem(dateString + "moves")))
        setTiles(JSON.parse(localStorage.getItem(dateString + "tiles")))
        setIsCompleted(JSON.parse(localStorage.getItem(dateString + "isCompleted")))
        // setWorteenDate(dateString)

        return
      }

			try {
				// const localDate = new Date()
				const response = await fetch('https://worteen-backend.vercel.app//?date=' + JSON.stringify(localDate), {
					headers: {
						'Accept': 'application/json',
					}
				})
				const responseJson = await response.json()
				setTiles(JSON.parse(responseJson))
        setWorteenDate("" + localDate.getFullYear() + "-" + (localDate.getMonth() + 1) + "-" + localDate.getDate())
        localStorage.setItem("GamesPlayed", localStorage.getItem("GamesPlayed") ? JSON.parse(localStorage.getItem("GamesPlayed")) + 1 : 1)
			}
			catch (err) {
				console.log(err)
			}
		}

		fetchData()
	}, [])

  useEffect(() => {
    if (lastWorteenCompleted) {
      const lastWorteenDate = new Date(lastWorteenCompleted)
      const now = new Date()

      if ((now - lastWorteenDate) / (1000 * 60 * 60 * 24) < 1) {
        setIsCurrentStreak(true)
      }
    }
  }, [lastWorteenCompleted])

  // handle closing app
  useEffect(() => {
    const saveData = () => {

      if (!worteenDate) {
        return
      }

      localStorage.setItem(worteenDate + "tiles", JSON.stringify(tiles))
      localStorage.setItem(worteenDate + "time", JSON.stringify(time))
      localStorage.setItem(worteenDate + "moves", JSON.stringify(moves))
      localStorage.setItem(worteenDate + "completed", JSON.stringify(isCompleted))
    }

    window.addEventListener("beforeunload", saveData)

    return () => {
      window.removeEventListener("beforeunload", saveData)
    }
}, [time, tiles, moves, worteenDate])

  // handle tile swapping
	useEffect(() => {
		window.addEventListener("keydown", handleKeyPress)
		return () => {
			window.removeEventListener("keydown", handleKeyPress)
		}
	}, [tiles, swapDisabled])

  const handleKeyPress = ({key}) => {

    if (swapDisabled) {
      return
    }

		let tileIndex
		if (key === "ArrowDown") {
			tileIndex = tiles.indexOf(0) - 4
		}
		else if (key === "ArrowUp" && tiles.indexOf(0) + 4 < 16) {
			tileIndex = tiles.indexOf(0) + 4
		}
		else if (key === "ArrowRight" && tiles.indexOf(0) % 4 - 1 >= 0) {
			tileIndex = tiles.indexOf(0) - 1
		}
		else if (key === "ArrowLeft" && tiles.indexOf(0) % 4 + 1 < 4) {
			tileIndex = tiles.indexOf(0) + 1
		}
		else {
			return
		}

		swapTiles(tileIndex)
	}

	const handleTileClick = (index) => {
		swapTiles(index)
	}

  const swapTiles = (tileIndex) => {

		if (canSwap(tileIndex, tiles.indexOf(0))) {
			const swappedTiles = swap(tiles, tileIndex, tiles.indexOf(0))
			setTiles(swappedTiles)

			setMoves(moves + 1)

			if (!timerRunning) {
				setTimerRunning(true)
				setTime(time + 1)
			}
		}
	}

  // handling timer
  useEffect(() => {
		if (timerRunning) {
			setTimeout(() => setTime(time + 1), 1000)
		}
	}, [time])

  useEffect(() => {

    const onBlur = () => {
      if (timerRunning) {
        const localDate = new Date()
        const dateString = "" + localDate.getFullYear() + "-" + (localDate.getMonth() + 1) + "-" + localDate.getDate()
        setTimerRunning(false)
      }
    }

    window.addEventListener("blur", onBlur)

    return () => {
      // window.removeEventListener("focus", onFocus)
      window.removeEventListener("blur", onBlur)
    }
  }, [time, timerRunning])

  // handling green tiles and puzzle completion
  useEffect(() => {
		const greenTiles = [...correctTiles]
		if (greenTiles.length > 0 && !greenTiles.includes(0)) {
      // worteen completed

      const lastWorteenDate = new Date(lastWorteenCompleted)
      const now = new Date()

      if (Math.floor((now - lastWorteenDate) / (1000 * 24 * 60 * 60)) != 0) {
        localStorage.setItem("GamesCompleted", JSON.stringify(gamesCompleted + 1))
      
        localStorage.setItem("AverageTime", JSON.stringify((gamesCompleted * averageTime + time) / (gamesCompleted + 1)))
        localStorage.setItem("AverageMoves", JSON.stringify((gamesCompleted * averageMoves + moves) / (gamesCompleted + 1)))

        if (isCurrentStreak) {
          localStorage.setItem("CurrentStreak", JSON.stringify(JSON.parse(localStorage.getItem("CurrentStreak")) + 1))
          if (localStorage.getItem("CurrentStreak") > maximumStreak) {
            localStorage.setItem("MaximumStreak", JSON.stringify(localStorage.getItem("CurrentStreak")))
          }
        }

        localStorage.setItem("LastWorteenCompleted", JSON.stringify(worteenDate))
      }

			setTimerRunning(false)
      setSwapDisabled(true)
			setTimeout(() => setIsCompleted(true), 1000)
		}
	}, [correctTiles])

  useEffect(() => {
    if (isCompleted) {
      setSwapDisabled(true)
    }
  }, [isCompleted])

	useEffect(() => {
		const checkSolved = async () => {
			try {
				const response = await fetch(
					"https://worteen-backend.vercel.app/check",
					{
						method: "POST",
						mode: 'cors',
						credentials: 'same-origin',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({"grid": tiles})
					}
				)
				
				const responseJson = await response.json()

				const checkResult = JSON.parse(responseJson)

				const greenTiles = []

				for (let i = 0; i < checkResult.length; i++) {
					for (let j = i * 4; j < (i + 1) * 4; j++) {
						if (checkResult[i] == 1) {
							greenTiles.push(1)
						}
						else {
							greenTiles.push(0)
						}
					}
				}

				setCorrectTiles([...greenTiles])
			}
			catch (err) {
				console.log(err)
			}
		}

		checkSolved()
	}, [tiles])

  const getCompliment = () => {
		if (compliment) {
			return compliment
		}
		
		const complimentArr = ["Amazing", "Fantastic", "Incredible", "Woohoo!", "Splendid", "Stunning", "Awesome", "Great!", "Marvelous", "Well done!"]
		const complimentIndex = Math.floor(Math.random() * complimentArr.length)
		setCompliment(complimentArr[complimentIndex])
		return complimentArr[complimentIndex]
	}

  return (
    <div className = "App">
      <div className = "Header">
        <h1>Worteen</h1>
        <FaInfoCircle color = {"#fff"} size = {24} onClick = {() => setShowInstructions(true)} />
      </div>
      {!(correctTiles.length == 0 || [...correctTiles].includes(0) || isCompleted) &&
				<div className = "Completion-Toast">
					<h4>{getCompliment()}</h4>
				</div>
			}
			{isCompleted &&
        <>
          <div className = "Overlay" />
				  <CompletedPopup className = "Completion-Popup-Container" time = {time} moves = {moves} />
        </>
      }
      {showInstructions &&
        <>
          <div className = "Overlay" />
          <InstructionsPopup className = "Instructions-Popup" onClose = {() => setShowInstructions(false)} />
        </>
      }
      <Board tiles = {tiles} correctTiles = {correctTiles} handleTileClick = {swapDisabled ? () => {} : handleTileClick} />
      <div className = "Details-Container">
        <Timer className = "Timer" time = {time} />
			  <MoveCounter className = "Move-Counter" moves = {moves} />
      </div>
    </div>
  );
}

export default App;
