const GameDetails = ({home, away, time}) => {
    return (
        <div className="container border">
            <p><strong>Away: </strong>{away}  <strong>Home: </strong>{home} </p>
            <p><strong>Time: </strong> {time} </p>
        </div>
    )
}

export default GameDetails;