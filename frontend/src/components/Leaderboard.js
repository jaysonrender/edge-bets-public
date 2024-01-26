//Leaderboard gets the scores of the 5 prospective winners and renders them in a table

import { useState, useEffect } from "react";
import axios from 'axios';

import { useUserContext } from "../hooks/useUserContext";
import { useLogout } from "../hooks/useLogout";

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    const { leagueID, userToken } = useUserContext();
    const { logout } = useLogout();


    useEffect(() => {
        const fetchLeaders = async () => {
            const url = `/api/pick/leagueLeaders/${leagueID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if (error.response.status === 401)
                    logout();
            });
    
            setLeaders(data);
        }

        fetchLeaders();
        
    }, [leagueID, userToken]);

    return (
        <div className="container">
            <table className="table table-hover table-sm">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaders && leaders.map((leader) => {
                        return (
                            
                            <tr key={leader.user_id}>
                                <td>{leader.player_rank}</td>
                                <td>{leader.fname + " " + leader.lname}</td>
                                <td>{leader.score}</td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
            
        </div>
    )
}

export default Leaderboard;