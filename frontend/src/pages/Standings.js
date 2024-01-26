
import Scoreboard from '../components/Scoreboard';
import { useUserContext } from '../hooks/useUserContext';
const Standings = () => {

    const {leagueName} = useUserContext();

    return (
        <div className='container'>
            <h2> {leagueName} </h2>
            <Scoreboard />
        </div>
    )
}

export default Standings;