import { useState } from "react";
import isEmail from 'validator/lib/isEmail';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = async (event) => {
        event.preventDefault();
        setError(null);

        //validate email
        if(!isEmail(email))
            setError('This not a valid email');
        else {
            await axios.post('/api/user/forgot-password', {email: email}).then(response => {
                setError(response.data.errorMessage);
            }).catch(error => {
                if (error.response.status === 400)
                    setError(error.response.data.errorMessage);
            })
        }
        //axios call get userID by email

    }


    return (
        <div className="container">
            <br />
            <h3>Forgot Password?</h3>
            
            
            <div className="col-md-6">
            <label>Enter your email</label>
            <input type='text' className="form-control" onChange={(event) => setEmail(event.target.value)}></input>
            
            </div>
            
            <br />
            <div>
            <button className="btn btn-dark" onClick={handleClick}>Send Password Reset Email</button>
            </div>
            <div>{error}</div>
            

        
            
        </div >
        
    )
    
}

export default ForgotPassword;