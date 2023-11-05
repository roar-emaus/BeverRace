import React, { useState } from 'react'

interface BeaverProps {
    beaverNumber: number
    pos: number
}

function Beaver({ beaverNumber, pos }: BeaverProps) {
    return (
        <div
            className={`beaver`}
            style={{ left: `${pos}px`, top: `${beaverNumber * 40 + 20}px` }}
        ></div>
    )
}

export default Beaver
