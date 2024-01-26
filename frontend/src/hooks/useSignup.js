import {useState} from 'react';
import {useUserContext} from './useUserContext';
import axios from 'axios';

export const useSignup = () => {
    const [error, setError] = useState(null);
    
    const {dispatch} = useUserContext();

    const signup = async ({leagueID, fname, lname, username, password, email, userType }) => {
        
        const requestBody = {leagueID, fname, lname, username, password, email, userType };
        
        await axios.post(`/api/user/join-league`, requestBody).then(response => {
            
            setError(response.data.message)
            if (response.status === 200){
                localStorage.setItem('user', JSON.stringify(response.data.userToken));
    
                dispatch({type: 'LOGIN', leagueID: response.data.leagueID, userID: response.data.userID, leagueName: response.data.leagueName, username: username, userType: userType, userToken: response.data.userToken});
                
            }
        }).catch((error) =>{
            setError(error.response.data.message)
        });
    }

    return {signup,  error}
} 