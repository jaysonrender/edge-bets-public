import { useUserContext } from "./useUserContext";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    //get dispatch function to change UserContext state
    const {dispatch} = useUserContext();
    const navigate  = useNavigate();

    const logout = () => {
        //remove user token from local storage
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'});
        navigate('/');

    }
    
    return {logout};
}