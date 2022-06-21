import {useState, useEffect} from 'react'
import './App.css';
import Board from './Board/Board.js'
import Timer from './Timer/Timer.js'
import MoveCounter from './MoveCounter/MoveCounter.js'
import {swap, canSwap} from './common/helper'
import {getTimerRunning, startStopTimer} from './common/helper.js'
import CompletedPopup from './CompletedPopup/CompletedPopup';
import InstructionsPopup from './InstructionsPopup/InstructionsPopup';
import {FaInfoCircle} from 'react-icons/fa'
import {MdLeaderboard} from 'react-icons/md'
import preloader from './preloader.gif'
import { useSwipeable } from 'react-swipeable';

let fetching = false

function App() {

  const [tiles, setTiles] = useState([])
	const [correctTiles, setCorrectTiles] = useState([...Array(2)].keys())
	const [isCompleted, setIsCompleted] = useState(false)
	const [moves, setMoves] = useState(0)
	const [time, setTime] = useState(0)
	const [timerRunning, setTimerRunning] = useState(false)
	const [compliment, setCompliment] = useState("")
  const [swapDisabled, setSwapDisabled] = useState(true)
  const [worteenDate, setWorteenDate] = useState("")
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [gamesCompleted, setGamesCompleted] = useState(0)
  const [maximumStreak, setMaximumStreak] = useState(0)
  const [lastWorteenCompleted, setLastWorteenCompleted] = useState(null)
  const [isCurrentStreak, setIsCurrentStreak] = useState(false)
  const [averageTime, setAverageTime] = useState(0)
  const [averageMoves, setAverageMoves] = useState(0)
  const [showInstructions, setShowInstructions] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completedPopupVisible, setCompletedPopupVisible] = useState(true)

  useEffect(() => {

    // Initialize puzzle
		const fetchData = async () => {

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

        if (!JSON.parse(localStorage.getItem(dateString + "isCompleted"))) {
          setSwapDisabled(false)
        }

        setLoading(false)

        return
      }

			try {
				// const localDate = new Date()
				fetch('https://worteen-backend.vercel.app/?date=' + JSON.stringify(localDate.getTime() - (localDate.getTimezoneOffset() * 60000)), {
          method: "GET",
          mode: 'cors',
					credentials: 'same-origin',
					headers: {
						'Accept': 'application/json',
					}
				}).then(async response => {
          response.json().then(responseJson => {
            setTiles(JSON.parse(responseJson))
            setWorteenDate("" + localDate.getFullYear() + "-" + (localDate.getMonth() + 1) + "-" + localDate.getDate())
            localStorage.setItem("GamesPlayed", localStorage.getItem("GamesPlayed") ? JSON.parse(localStorage.getItem("GamesPlayed")) + 1 : 1)
            if (responseJson.length > 0) {
              setLoading(false)
              setSwapDisabled(false)
            }
          })
        })
      }
			catch (err) {
				console.log(err)
			}
		}

    if (!fetching) {
      fetchData()
      fetching = true
    }
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

      if (tiles.length === 0) {
        return
      }
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
		if (key === "ArrowDown" && tiles.indexOf(0) - 4 >= 0) {
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (swapDisabled) {
        return
      }

      if (tiles.indexOf(0) % 4 + 1 < 4) {
        swapTiles(tiles.indexOf(0) + 1)
      }
    },

    onSwipedRight: (eventData) => {
      if (swapDisabled) {
        return
      }

      if (tiles.indexOf(0) % 4 - 1 >= 0) {
        swapTiles(tiles.indexOf(0) - 1)
      }
    },

    onSwipedDown: (eventData) => {
      if (swapDisabled) {
        return
      }

      if (tiles.indexOf(0) - 4 >= 0) {
        swapTiles(tiles.indexOf(0) - 4)
      }
    },

    onSwipedUp: (eventData) => {
      if (swapDisabled) {
        return
      }
      
      if (tiles.indexOf(0) + 4 < 16) {
        swapTiles(tiles.indexOf(0) + 4)
      }
    }

  })

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

  useEffect(() => {
    if (worteenDate) {
      localStorage.setItem(worteenDate + "tiles", JSON.stringify(tiles))
      localStorage.setItem(worteenDate + "moves", JSON.stringify(moves))

      for (let item in {...localStorage}) {
        if (item.match(/^\d/)) {
          if (!item.startsWith(worteenDate)) {
            localStorage.removeItem(item)
          }
        }
      }
    }
  }, [moves, tiles])

  // handling timer
  useEffect(() => {
		if (timerRunning) {
      localStorage.setItem(worteenDate + "time", JSON.stringify(time))
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
			setTimerRunning(false)
      setSwapDisabled(true)
			setTimeout(() => setIsCompleted(true), 1000)
		}
	}, [correctTiles])

  useEffect(() => {
    if (isCompleted) {
      const lastWorteenDate = new Date(lastWorteenCompleted)
      const now = new Date()

      if (Math.floor((now - lastWorteenDate) / (1000 * 24 * 60 * 60)) != 0) {
      
        localStorage.setItem("GamesCompleted", JSON.stringify(gamesCompleted + 1))

        localStorage.setItem(worteenDate + "completed", JSON.stringify(isCompleted))

        localStorage.setItem("AverageTime", JSON.stringify(Math.floor((gamesCompleted * averageTime + time) / (gamesCompleted + 1))))
        localStorage.setItem("AverageMoves", JSON.stringify(Math.floor((gamesCompleted * averageMoves + moves) / (gamesCompleted + 1))))

        if (isCurrentStreak) {
          localStorage.setItem("CurrentStreak", JSON.stringify(JSON.parse(localStorage.getItem("CurrentStreak")) + 1))
          if (localStorage.getItem("CurrentStreak") > maximumStreak) {
            localStorage.setItem("MaximumStreak", JSON.stringify(localStorage.getItem("CurrentStreak")))
          }
        }

        localStorage.setItem("LastWorteenCompleted", JSON.stringify(worteenDate))
      }
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

  if (loading) {
    return (
      <div className = "Fullscreen">
        <img src = {preloader} className = "Preloader" />
      </div>
    )
  }

  return (
    <div className = "App" {...swipeHandlers}>
      <div className = "Header">
        <h1>Worteen</h1>
        <div className = "Right-Icons">
          <FaInfoCircle color = {"#fff"} size = {24} onClick = {() => setShowInstructions(true)} />
          <MdLeaderboard color = {isCompleted ? "#fff" : "#777"} size = {24} onClick = {() => isCompleted ? setCompletedPopupVisible(true) : null} />
        </div>
      </div>
      {!([...correctTiles].length == 0 || [...correctTiles].includes(0) || isCompleted) &&
				<div className = "Completion-Toast">
					<h4>{getCompliment()}</h4>
				</div>
			}
			{isCompleted && completedPopupVisible &&
        <>
          <div className = "Overlay" />
				  <CompletedPopup className = "Completion-Popup-Container" time = {time} moves = {moves} onClose = {() => setCompletedPopupVisible(false)} />
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
