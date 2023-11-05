import React, { useState, useRef } from 'react'
import './BeaverRace.css'
import Beaver from './Beaver'
import { normal } from 'jstat' // Importing a statistics library for normal distribution

function BeaverRace() {
    const [beaverPos, setBeaverPos] = useState<number[]>([])
    const [raceInProgress, setRaceInProgress] = useState(false)
    const [numBeavers, setNumBeavers] = useState(5)
    const [beaverOdds, setBeaverOdds] = useState<
        { name: string; odds: number }[]
    >([])
    const trackRef = useRef(null) // Ref for the track

    React.useEffect(() => {
        setBeaverPos(Array.from({ length: numBeavers }, () => 0))
        setBeaverOdds(
            Array.from({ length: numBeavers }, (_, i) => ({
                name: `Beaver ${i}`,
                odds: Math.floor(Math.random() * 10) + 1,
            }))
        )
    }, [numBeavers])

    // Convert odds to a mean speed (the lower the odds, the higher the mean speed)
    const meanSpeeds = beaverOdds.map((beaver) => 10 - beaver.odds / 10)
    const standardDeviations = meanSpeeds.map((meanSpeed) => meanSpeed / 1) // Adjust this to change variability
    function startRace() {
        setRaceInProgress(true)

        const finishLine = trackRef.current ? trackRef.current.clientWidth : 0

        const raceInterval = setInterval(() => {
            setBeaverPos((prevPos) => {
                const newPos = [...prevPos]
                for (let i = 0; i < numBeavers; i++) {
                    newPos[i] += Math.abs(
                        normal.sample(meanSpeeds[i], standardDeviations[i])
                    )
                    if (newPos[i] >= finishLine) {
                        finishRace(raceInterval, i)
                        return prevPos
                    }
                }
                return newPos
            })
        }, 100)
    }

    function finishRace(raceInterval: number, winningBeaver: number) {
        clearInterval(raceInterval)
        setRaceInProgress(false)
        alert(`Beaver ${winningBeaver} wins!`)
    }

    return (
        <div>
            <div className={`track`} ref={trackRef}>
                {Array.from({ length: numBeavers }, (_, i) => (
                    <Beaver key={i} beaverNumber={i} pos={beaverPos[i]} />
                ))}
            </div>
            {raceInProgress ? (
                <button disabled>...</button>
            ) : (
                <button onClick={startRace}>Start Race</button>
            )}
        </div>
    )
}

export default BeaverRace
