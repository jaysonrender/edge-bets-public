import {useState, useEffect } from 'react';
import axios from 'axios';
import GameDetails from '../components/GameDetails';
import WeekOptions from '../components/WeekOptions';
import { useUserContext } from '../hooks/useUserContext';
import { useLogout } from '../hooks/useLogout';
import getCurrentWeek from '../util/getCurrentWeek';

const Games = () => {

    const [games, setGames] = useState(null);
    const [pickWeek, setPickWeek] = useState(getCurrentWeek(new Date()));
    
    const { userToken } = useUserContext();
    const { logout } = useLogout();

    const getTimeString = (game_time) => {
        let date = new Date(game_time);

        return date.toLocaleString();
    }

    useEffect(() => {

        const fetchGames = async () => {
            const url = `/api/pick/games/${pickWeek}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if (error.response.status === 401)
                    logout();
            });
            const data = response.data;
            
            setGames(data);  
        }

        fetchGames();
    }, [pickWeek, userToken]);

    return (
        <div className="container">
            <h1>Games</h1>
            <form id="week-select">
            
            <select id='pickWeek' name='Pick Week' onInput={(event) => {
                setPickWeek(event.target.value)
            }}>
                <option value={pickWeek}>NFL Week</option>
                <WeekOptions />
            </select>
            </form>
            
            {/** Edit this each season */}
            <h3>2023 Regular Season Week {pickWeek} </h3>
            
            <div className='games'>
                {games && games.map((game) => (
                    <div>
                <GameDetails key={game.game_id} home={game.home} away={game.away} time= {getTimeString(game.game_time)} />
                    
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Games;