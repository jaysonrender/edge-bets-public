//updates User state for frontend and caches relevant or frequently queried information about user to reduce the need for database connections

import {createContext, useReducer, useEffect } from 'react';


export const UserContext = createContext();

export const userReducer = (state, action) => {
    switch (action.type){
        case 'LOGIN':
            return {leagueID: action.leagueID, userID: action.userID, leagueName:action.leagueName, username: action.username, userType: action.userType ,userToken: action.userToken};
        case 'LOGOUT':
            return {leagueID: null, userID: null, leagueName: null, username: null, userType: null, userToken: null};
        default:
            return state;
        }
}


export const UserContextProvider = ({children}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [state, dispatch] = useReducer(userReducer, user);

    useEffect(() => {
        
        if(!user)
            dispatch({type: 'LOGOUT'});    

    },[]);


    return (
        <UserContext.Provider value={{...state, dispatch}}>
            { children }
        </UserContext.Provider>
    )
}