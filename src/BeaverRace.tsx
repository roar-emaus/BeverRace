import React, { useState, useRef } from 'react';
import './BeaverRace.css';
import { normal } from 'jstat'; // Importing a statistics library for normal distribution

function BeaverRace() {
    const [beaver1Pos, setBeaver1Pos] = useState(0);
    const [beaver2Pos, setBeaver2Pos] = useState(0);
    const [beaver3Pos, setBeaver3Pos] = useState(0);
    const [raceInProgress, setRaceInProgress] = useState(false);
    const trackRef = useRef(null); // Ref for the track
    const beaver1Ref = useRef(null); // Ref for the beaver
    const beaver2Ref = useRef(null); // Ref for the beaver
    const beaver3Ref = useRef(null); // Ref for the beaver

    
    // Define odds for each beaver
    const beaverOdds = [
        { name: 'Beaver 1', odds: 2 }, // 2:1 odds
        { name: 'Beaver 2', odds: 3 }, // 3:1 odds
        { name: 'Beaver 3', odds: 5 }, // 5:1 odds
    ];

    // Convert odds to a mean speed (the lower the odds, the higher the mean speed)
    const meanSpeeds = beaverOdds.map(beaver => 6 - beaver.odds);
    const standardDeviations = meanSpeeds.map(meanSpeed => meanSpeed / 3); // Adjust this to change variability
function startRace() {
    setRaceInProgress(true);

    // You could get track and beaver dimensions here, assuming elements are rendered
    const trackWidth = trackRef.current ? trackRef.current.clientWidth : 0;
    const beaverWidth = beaver1Ref.current ? beaver1Ref.current.offsetWidth : 0;
    const finishLine = trackWidth - beaverWidth;

    console.log(trackWidth);
    console.log(beaverWidth);
    const raceInterval = setInterval(() => {
        setBeaver1Pos(prevPos => {
            const newPos = prevPos + normal.sample(meanSpeeds[0], standardDeviations[0]);
            if (newPos >= finishLine) {
                finishRace(raceInterval, 1);
                return finishLine; // Ensure we don't go past the finish line
            }
            return newPos;
        });
        setBeaver2Pos(prevPos => {
            const newPos = prevPos + normal.sample(meanSpeeds[1], standardDeviations[1]);
            if (newPos >= finishLine) {
                finishRace(raceInterval, 2);
                return finishLine;
            }
            return newPos;
        });
        setBeaver3Pos(prevPos => {
            const newPos = prevPos + normal.sample(meanSpeeds[2], standardDeviations[2]);
            if (newPos >= finishLine) {
                finishRace(raceInterval, 3);
                return finishLine;
            }
            return newPos;
        });
      }, 100);
  }
  
  function finishRace(raceInterval, winningBeaver) {
    clearInterval(raceInterval);
    setRaceInProgress(false);
    alert(`Beaver ${winningBeaver} wins!`);
    // Reset positions
    setBeaver1Pos(0);
    setBeaver2Pos(0);
    setBeaver3Pos(0);
}

    return (
        <div>
            <div className={`track`} ref={trackRef}>
                <div className={`beaver beaver1`} ref={beaver1Ref} style={{ left: `${beaver1Pos}px` }}></div>
                <div className={`beaver beaver2`} ref={beaver2Ref} style={{ left: `${beaver2Pos}px` }}></div>
                <div className={`beaver beaver3`} ref={beaver3Ref} style={{ left: `${beaver3Pos}px` }}></div>
            </div>
            {raceInProgress ? (
                <button disabled>...</button>
            ) : (
                <button onClick={startRace}>Start Race</button>
            )}
        </div>
    );
}

export default BeaverRace;
