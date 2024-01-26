import {useState} from 'react';
import {useUserContext} from './useUserContext';
import axios from 'axios';

export const useLogin = () => {
    const [error, setError] = useState(null);
    
    const {dispatch} = useUserContext();

    const login = async ({username, password}) => {
        
        const requestBody = {username, password};
        
        await axios.post(`/api/user/login`, requestBody).then(response => {
            setError(response.data.message);
            

            if (response.status === 200){
                localStorage.setItem('user', JSON.stringify(response.data));
                
                //dispatch updates UserContext
                dispatch({type: 'LOGIN', leagueID: response.data.leagueID, userID: response.data.userID, leagueName: response.data.leagueName, username: response.data.username, userType: response.data.userType, userToken: response.data.userToken});
                

                
            }
        }).catch((error) =>{
            if (error.response){
                setError(error.response.data.message);
                
            }
            else { 
                setError(error.message);
            }
            
        });
    }
    

    return {login, error}
} 