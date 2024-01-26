import { useState, useEffect } from 'react';
import { useUserContext } from '../hooks/useUserContext';
// import {useTable} from 'react-table';
import axios from 'axios';

const RemainingPicks = () => {
    const [remainingPicks, setRemaining] = useState(null);
    const { userID, userToken } = useUserContext();

    useEffect(() => {
        const fetchRemainingPicks = async () => {
            const url = `/api/pick/picksRemaining/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            setRemaining(data);
        }
        fetchRemainingPicks();
    }, [userID, userToken]);


    return (
        <div>
            {/* <table>
                <thead>
                    <th>Teams Not Yet Picked</th>
                </thead>
                <tbody>
                    {remainingPicks && remainingPicks.map((pick) => {
                        return (
                            <tr>
                                <td>{pick.alias} - {pick.team_name}</td>
                            </tr>
                        )
                    })}
                </tbody>

            </table> */}
            <h4>Teams Not Yet Picked</h4>
            <ul className='list-group'>
                {remainingPicks && remainingPicks.map((pick) => {
                    return (
                        <li className='list-group-item '>{pick.alias} - {pick.team_name}</li>
                    )
                })}
            </ul>
        </div>
    )
}

export default RemainingPicks;