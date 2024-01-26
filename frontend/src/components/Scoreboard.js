import { useState, useEffect /*, useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import axios from 'axios';
import { useLogout } from '../hooks/useLogout';
import getCurrentWeek from '../util/getCurrentWeek';

// might use react-table for table building down the line but having trouble getting to work right now
// import { useTable } from 'react-table';


const Scoreboard = () => {
    const [scores, setScores] = useState(null);
    const [gameTimes, setGameTimes] = useState(null);
    const { leagueID, userID, userToken } = useUserContext();
    const { logout } = useLogout();
    const currentDate = new Date().toISOString();
    const currentWeek = getCurrentWeek(new Date());


    const ScoreboardHeaders = () => {

        const lengths = scores.map(player => player.picks.length);
        const maxLength = Math.max(...lengths);
        let headers = [];
        headers.push((
            <>
                <th >Rank</th>
                <th className='table-name-column'>Name</th>
                <th className="table-name-column">Score</th>
                <th className='table-total-column'>Flex Picks</th>
            </>
        ));
        for (let i = 0; (i < currentWeek && i < 18); i++) {
            headers.push((
                <>
                    <th>Week</th>
                    <th>Pick #1</th>
                    <th>Score</th>
                    <th>Pick #2</th>
                    <th >Score</th>
                    <th className='table-total-column'>Week Total</th>
                </>
            ))
        }
        return headers;
    }


    const ScoreboardRows = () => {


        //name rank and score as usual
        //like headers find max length
        const lengths = scores.map(player => player.picks.length);
        const maxLength = Math.max(...lengths);
        let rows = scores.map((player) => {

            let row = [];
            row.push((
                <>
                    <td className='border-end border-2 border-black'>{player.player_rank}</td>
                    <td className='border-end border-2 border-black' style={{ "whiteSpace": "nowrap" }}>{player.fullname}</td>
                    
                    <td className='border-end border-2 border-black'>{player.score}</td>
                    <td className='table-total-column'>{player.flex_picks}</td>
                </>
            ));

            for (let i = 0; (i < currentWeek && i < 18); i++) {
                
                
                //if pick exists for that week and is in the expected spot in the array
                if (player.picks[i] && player.picks[i].pick_week === i + 1) {
                    
                    //find pick in game of games (pick_week == nfl_week and pick1 === home || pick1 === away)
                    //if game_time > current time
                    //push null td (see else block)
                    const pick1GameTime = gameTimes.find((game) => player.picks[i].pick_week === game.nfl_week && (player.picks[i].pick1 === game.home || player.picks[i].pick1 === game.away));
                    const pick2GameTime = gameTimes.find((game) => player.picks[i].pick_week === game.nfl_week && (player.picks[i].pick2 === game.home || player.picks[i].pick2 === game.away));
                    const hidePick1 = ((pick1GameTime !== undefined && pick1GameTime.game_time > currentDate) || (pick1GameTime === undefined));
                    const hidePick2 = ((pick2GameTime !== undefined && pick2GameTime.game_time > currentDate) || (pick2GameTime === undefined));
                    
                        row.push(
                            <>
                                <td className='table-week-column'><strong>{player.picks[i].pick_week}</strong></td>
                                <td><strong>{hidePick1 ? null : player.picks[i].pick1}</strong></td>
                                <td className='table-score-column'>{hidePick1 ? null : player.picks[i].pick1_score}</td>
                                <td><strong>{hidePick2 ? null : player.picks[i].pick2}</strong></td>
                                <td className='table-score-column'>{hidePick2 ? null : player.picks[i].pick2_score}</td>
                                <td className='table-total-column'>{((hidePick1 && hidePick2))? null : player.picks[i].week_total}</td>
                            </>
                        )
                    

                    //if pick exists for that week but is not in the expected spot in the array
                } else if (!player.picks[i] && player.picks.some((pick) => pick.pick_week === i + 1)) {
                    
                                        
                    const index = player.picks.findIndex((pick) => pick.pick_week === i + 1);

                    const pick1GameTime = gameTimes.find((game) => player.picks[index].pick_week === game.nfl_week && (player.picks[index].pick1 === game.home || player.picks[index].pick1 === game.away));
                    const pick2GameTime = gameTimes.find((game) => player.picks[index].pick_week === game.nfl_week && (player.picks[index].pick2 === game.home || player.picks[index].pick2 === game.away));
                    const hidePick1 = ((pick1GameTime !== undefined && pick1GameTime.game_time > currentDate) || (pick1GameTime === undefined));
                    const hidePick2 = ((pick2GameTime !== undefined && pick2GameTime.game_time > currentDate) || (pick2GameTime === undefined));


                    row.push(
                        <>
                            <td className='table-week-column'><strong>{player.picks[index].pick_week}</strong></td>
                            <td><strong>{(pick1GameTime !== undefined && pick1GameTime.game_time > currentDate) ? null : player.picks[index].pick1}</strong></td>
                            <td className='table-score-column'>{(pick1GameTime !== undefined && pick1GameTime.game_time > currentDate) ? null : player.picks[index].pick1_score}</td>
                            <td><strong>{(pick2GameTime !== undefined && pick2GameTime.game_time > currentDate) ? null : player.picks[index].pick2}</strong></td>
                            <td className='table-score-column'>{(pick2GameTime !== undefined && pick2GameTime.game_time > currentDate) ? null : player.picks[index].pick2_score}</td>
                            <td className='table-total-column'>{(hidePick1 && hidePick2) ? null : player.picks[index].week_total}</td>

                        </>
                    )
                    //if no pick exists for that week
                } else {
                    row.push(
                        <>
                            <td className='table-week-column'><strong>{i + 1}</strong></td>
                            <td>{null}</td>
                            <td className='table-score-column'>{null}</td>
                            <td>{null}</td>
                            <td className='table-score-column'>{null}</td>
                            <td className='table-total-column'>{null}</td>
                        </>

                    )
                }
            }
            //highlight users row in the table 
            if (player.user_id === userID) {
                return (<tr className='table-success border-black'>{row}</tr>);
            }
            else {
                return (<tr key={player.user_id}>{row}</tr>);
            }


        })

        return rows;
    }

    //useEffect is call right when this element renders
    useEffect(() => {
        const fetchScores = async () => {
            const url = `/api/pick/scoreboard/${leagueID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if (error.response.status === 401)
                    logout();
            });

            setScores(data);
        }

        const fetchGameTimes = async () => {
            const url = `/api/pick/getAllGameTimes`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error.message);
            });
            
            setGameTimes(data);
        }

        fetchScores();
        fetchGameTimes();


    }, [leagueID, userToken]);

    return (
        <div className='overflow-auto ' >

            <table className='table table-hover table-striped table-sm' border='1' style={{ 'borderCollapse': 'collapse' }} >
                <thead>
                    <tr>
                        {(scores && gameTimes) && <ScoreboardHeaders />}
                    </tr>
                </thead>
                <tbody>
                    {(scores && gameTimes) && <ScoreboardRows />}

                </tbody>
            </table>
        </div>


    );


}

export default Scoreboard;