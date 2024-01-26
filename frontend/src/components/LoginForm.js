import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';

import {useLogin} from '../hooks/useLogin';


const LoginForm = () => {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {login, error} = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //sends HTTP request to backend API to verify user
        const requestBody = {username, password};
        await login(requestBody);
        
    }
    
    const navigateSignUp = () => {
        navigate('/signup');
    }

    const navigateCreateLeague = () => {
        navigate('/create-league');
    }

    
    return(
        <div className="container border rounded-1">
            <form className="loginForm" id="loginForm" onSubmit={handleSubmit} style={{"padding": "10px"}}>
                <div className='mb-3'>
                    <label>Username</label>
                    <input type = "text" autoCapitalize='none' className='form-control' onChange={(event) => setUsername(event.target.value)}>
                    </input>
                </div>
                <div className='mb-3'>
                    <label>Password</label>
                    <input type = "password" className='form-control' onChange={(event) => setPassword(event.target.value)}>
                    </input>
                </div>
                <div className='row justify-content-between'>
                    <div className ='col' id="loginResponse">{error}</div>
                    <div className='col text-end'><Link to='/forgot-password'>Forgot Password?</Link></div>
                </div>
                
                <br />
                <div className='row'>
                    <div className='col'>
                    <button type = "submit" className='btn btn-primary'>Login</button>
                    </div>
                    <div className='col'>
                    <button type = "button" className='btn btn-outline-primary text-nowrap' onClick={navigateSignUp}>Sign Up</button>
                    </div>
                    <div className='col'>
                    <button type = "button" className='btn btn-outline-primary text-nowrap' onClick={navigateCreateLeague}>Create A League</button>
                    </div>
                </div>
                
                
            </form>
            
        </div>
    )
}

export default LoginForm;