import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isExpired } from 'react-jwt';
import validator from 'validator';

import { useLogout } from '../hooks/useLogout';


const ResetPassword = () => {
    const { userID, token } = useParams();
    const [validLink, setValidLink] = useState(false);
    const [user, setUser] = useState(null);
    const [newPW, setNewPW] = useState(null);
    const [confirmPW, setConfirmPW] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const {logout} = useLogout();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (newPW !== confirmPW)
            setError('The two password fields must match');
        else if (!validator.isStrongPassword(newPW)){
            setError('This password is not strong enough (one upper- and lower-case letter, number, and special character');
        } else {
            //url /api/user/reset-password
            const url = `/api/user/reset-password`;
            const requestBody = {userID: userID, password: newPW}
            await axios.post(url, requestBody).then(response => {
                if (response.status === 200){
                    setError(response.data.errorMessage);
                    if(localStorage.getItem('user')) logout();
                    setTimeout(navigate, 3500, '/')
                    
                }
            }).catch((error) =>{
                setError(error.response.data.errorMessage)
            });
        }
    }

    const cancel = (event) => {
        event.preventDefault();
        if(localStorage.getItem('user')) logout();
        setTimeout(navigate, 500, '/');
        
    }
    useEffect(() => {
        const getUser = async () => {
            const url = `/api/user/user-info/${userID}`
            const { data } = await axios.get(url);
            if (data)
                setUser(data.user);
        }

        getUser();
        setValidLink(!isExpired(token));
        console.log(isExpired(token))
        //verify token


    }, [])
    return (
        <div className='container border rounded-1'>
            {
                (validLink && user) ?
                    <div>
                        <h3>Reset Password for {user.username} ({user.email})</h3>

                        <form id='reset-password-form' >
                            <div className='row'>
                                <div className='col-md-6'>
                                    <label>New Password</label>
                                    <input type='password' className='form-control' onChange={event => setNewPW(event.target.value)} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <label>Confirm New Password</label>
                                    <input type='password' className='form-control' onChange={event => setConfirmPW(event.target.value)} />
                                </div>
                            </div>
                            <br />
                            <button className='btn btn-dark me-4' onClick = {handleSubmit}>Reset Password</button>
                            <button className='btn btn-danger' onClick = {cancel}>Cancel</button>
                        </form>
                        <br />
                        <div>{error}</div>
                    </div>

                    :
                    <p>This password reset link is no longer valid or there is no user associated with this password reset link.</p>
            }

        </div>

    )
}

export default ResetPassword;