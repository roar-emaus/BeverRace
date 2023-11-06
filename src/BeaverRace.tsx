import React, { useState, useRef } from 'react'
import './BeaverRace.css'
import Beaver from './Beaver'

function randomNormal(mu = 0, sigma = 1) {
    let u = 0,
        v = 0
    while (u === 0) u = Math.random() // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num * sigma + mu // Adjusting for specified mean and standard deviation
    return num
}
const getBeaverSpeeds = (numBeavers: number) => {
    return Array.from(
        { length: numBeavers },
        () => Math.floor(Math.random() * 3) + 4
    )
}

const calculateStandardDeviations = (meanSpeeds: number[]) => {
    return meanSpeeds.map((meanSpeed) => meanSpeed * 2)
}

function BeaverRace() {
    const [raceInProgress, setRaceInProgress] = useState(false)
    const [numBeavers, setNumBeavers] = useState(8)
    const [beaverPos, setBeaverPos] = useState<number[]>([])
    const [winningBeaver, setWinningBeaver] = useState<number | null>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const raceInterval = useRef<number | null>(null)

    React.useEffect(() => {
        setBeaverPos(Array(numBeavers).fill(0))
        setWinningBeaver(null)
    }, [numBeavers])

    function startRace() {
        setRaceInProgress(true)
        const meanSpeeds = getBeaverSpeeds(numBeavers)
        const standardDeviations = calculateStandardDeviations(meanSpeeds)
        const finishLine = trackRef.current ? trackRef.current.clientWidth : 0
        raceInterval.current = window.setInterval(() => {
            // const raceInterval = setInterval(() => {
            setBeaverPos((prevPos) =>
                prevPos.map((pos, index) => {
                    const newPos =
                        pos +
                        Math.abs(
                            randomNormal(
                                meanSpeeds[index],
                                standardDeviations[index]
                            )
                        )
                    if (newPos >= finishLine) {
                        finishRace(index)
                    }
                    return newPos >= finishLine ? finishLine : newPos
                })
            )
        }, 100)
    }
    function resetRace() {
        setRaceInProgress(false)
        setBeaverPos(Array(numBeavers).fill(0))
        setWinningBeaver(null)
    }

    function finishRace(winningBeaver: number) {
        setRaceInProgress(false)
        clearInterval(raceInterval.current!)
        raceInterval.current = null
        setWinningBeaver(winningBeaver)
    }

    return (
        <div>
            <label htmlFor="numBeavers">Antall bevere:</label>
            <select
                id="numBeavers"
                value={numBeavers}
                onChange={(e) => setNumBeavers(Number(e.target.value))}
                disabled={raceInProgress}
            >
                {Array.from({ length: 7 }, (_, i) => i + 2).map((number) => (
                    <option key={number} value={number}>
                        {number}
                    </option>
                ))}
            </select>
            <div className={`track`} ref={trackRef}>
                {Array.from({ length: numBeavers }, (_, i) => (
                    <Beaver key={i} beaverNumber={i} pos={beaverPos[i]} />
                ))}
            </div>
            {winningBeaver !== null && (
                <div className="winnerOverlay">
                    <img
                        src={`/beaver${winningBeaver % 8}.png`}
                        className="winningBeaverImage"
                        alt={`Beaver ${winningBeaver} is the winner!`}
                    />
                    <div className="blinkingText">Vant!</div>
                </div>
            )}
            {!raceInProgress && (
                <div>
                    <button onClick={startRace}>Start</button>
                    <button onClick={resetRace}>Ny runde</button>
                </div>
            )}
        </div>
    )
}

export default BeaverRace
