interface BeaverProps {
    beaverNumber: number
    pos: number
}

function Beaver({ beaverNumber, pos }: BeaverProps) {
    return (
        <div
            className="beaver"
            style={{
                left: `${pos}px`,
                top: `${beaverNumber * 60 + 20}px`,
                backgroundImage: `url(/beaver${beaverNumber % 8}.png)`,
            }}
        ></div>
    )
}

export default Beaver
