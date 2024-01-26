import { useState, useEffect, /*useMemo*/ } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import { useLogout } from '../hooks/useLogout'
// import {useTable} from 'react-table';
import axios from 'axios';
import UserPickTable from '../components/UserPickTable';
import UserStats from '../components/UserStats';
import RemainingPicks from '../components/RemainingPicks';

const UserPicks = () => {
    const [picks, setPicks] = useState(null);
    const { userID, userToken } = useUserContext();
    const { logout } = useLogout();

    useEffect(() => {
        const fetchUserPicks = async () => {
            const url = `/api/pick/userPicks/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if (error.response.status === 401 )
                    logout();
            });
            setPicks(data);
            
        }
        fetchUserPicks();
    }, [userID, userToken]);

    return (
        
            <div className='container border'>
                <UserStats />
                
                <div className='row'>
                    
                        <UserPickTable />
                    </div>
                    <div className='row'>
                        <RemainingPicks />
                    </div>
                </div>
            

        );
}

export default UserPicks;