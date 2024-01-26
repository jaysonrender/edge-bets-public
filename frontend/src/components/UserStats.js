import {useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
// import {useTable} from 'react-table';
import axios from 'axios';


const UserStats = () => {
    const {leagueID, userID, userToken } = useUserContext();

    const [name, setName] = useState(null);
    const [score, setScore] = useState(null);
    const [rank, setRank] = useState(null);
    const [flexPicks, setFlexPicks] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            const url = `/api/pick/stats/${leagueID}/${userID}`;
            const {data} = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            setName(data.fullname);
            setScore(data.score);
            setRank(data.rank);
            setFlexPicks(data.flexPicks);
        }

        fetchUserStats();
    }, [leagueID, userID, userToken]);
    
  
 

    return (
        <div className='container userStatContainer'>

            <span><h4><strong>Name: </strong>{name}</h4></span>
            <span><h4><strong>Score: </strong>{score}</h4></span>
            <span><h4><strong>Rank: </strong>{rank}</h4></span>
            <span><h4><strong>Flex Picks Remaining: </strong>{flexPicks}/4</h4></span>

        </div>

    );
}

export default UserStats;