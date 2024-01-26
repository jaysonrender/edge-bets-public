
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

const AccountInfo = () => {
    const {userID, leagueID, userToken } = useUserContext();
    const {logout} = useLogout();
    const handleClick = () => {
        logout();
    }
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [leagueName, setLeagueName] = useState(null);
    
    useEffect(() => {
        const fetchAccountInfo = async () => {
            const url = `/api/pick/account/${leagueID}/${userID}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error);
            });
            const data = response.data;

            setName(data[0].full_name);
            setUsername(data[0].username);
            setEmail(data[0].email);
            setLeagueName(data[0].league_name);

        }

        fetchAccountInfo(); 
    }, [userID, leagueID, userToken])
    return (
        <ul className='navbar-nav'>
            <li className='nav-item dropdown '>
                <Link className="nav-link dropdown-toggle" role='button' data-bs-toggle="dropdown">My Account</Link>
                <ul className='dropdown-menu text-bg-secondary text-nowrap px-2'>
                    <li>Name: {name}</li>
                    <li>Username: {username}</li>
                    <li>Email: {email}</li>
                    <li>League Name: {leagueName}</li>
                    <li>League ID: {leagueID}</li>
                    <li><button className='btn btn-danger'onClick={handleClick}>Logout</button></li>
                </ul>
            </li>
        </ul>
    )
}

export default AccountInfo;