import { useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import { useDeletePick } from '../hooks/useDeletePick';
import Button from 'react-bootstrap/Button';
// import {useTable} from 'react-table';
import axios from 'axios';



const UserPickTable = () => {
    const [picks, setPicks] = useState(null);
    const [gameTimes, setGameTimes] = useState(null);
    const currentDate = new Date().toISOString();

    const { userID, userToken } = useUserContext();
    const { deletePick, error } = useDeletePick();

    const DeleteButton = ({ pick, pickWeek, userID }) => {


        const handleDelete = async () => {

            //find duplicate
            //if flexPickStatus true
            //update flex + 1

            const url = `/api/pick/userPicks/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            let flexPickStatus = data.some(element => (pick !== null && 
                                                      (pick === element.pick1 || pick === element.pick2) &&
                                                      (pickWeek !== element.pick_week)));
            

            await deletePick({ userToken, userID, pickWeek, pick, flexPickStatus });
            window.location.reload(false);
        }

        //open Warning Modal on click
        return (<Button variant='outline-danger' onClick={handleDelete}> X </Button>);
        //
    }



    useEffect(() => {
        const fetchUserPicks = async () => {
            const url = `/api/pick/userPicks/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            setPicks(data);
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


        fetchUserPicks();
        fetchGameTimes();
    }, [userID, userToken]);

    const UserPicksHeader = () => {
        return (
            <>
                <th>Week</th>
                <th>Pick #1</th>
                <th >Score</th>
                <th>Pick #2</th>
                <th >Score</th>
                <th >Week Total</th>
            </>
        )
    }

    const UserPickRows = () => {
        return picks.map((pick) => {

            const pick1GameTime = gameTimes.find((game) => pick.pick_week === game.nfl_week && (pick.pick1 === game.home || pick.pick1 === game.away));
            const pick2GameTime = gameTimes.find((game) => pick.pick_week === game.nfl_week && (pick.pick2 === game.home || pick.pick2 === game.away));

            return (
                <tr>
                    <td>{pick.pick_week}</td>
                    <td>{pick.pick1_name}</td>

                    {pick1GameTime !== undefined && pick1GameTime.game_time > currentDate ? <td><DeleteButton pick={pick.pick1} pickWeek={pick.pick_week} userID={userID} /></td> : <td >{pick.pick1_score}</td>}


                    <td>{pick.pick2_name}</td>
                    {pick2GameTime !== undefined && pick2GameTime.game_time > currentDate ? <td><DeleteButton pick={pick.pick2} pickWeek={pick.pick_week} userID={userID} /></td> : <td >{pick.pick2_score}</td>}
                    <td>{pick.week_total}</td>

                </tr>
            )
        });
    }

    return (
        <div >
            <h4>My Picks</h4>
            <table className='table table-sm table-borderless' >
                <thead>
                    <tr>{(picks && gameTimes) && <UserPicksHeader />}</tr>
                </thead>
                <tbody>
                    {(picks && gameTimes) && <UserPickRows />}
                </tbody>
            </table>
            
        </div>
    );
}

const DeleteWarningModal = () => {

}

export default UserPickTable;