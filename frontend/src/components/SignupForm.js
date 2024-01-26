import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';

const SignupForm = (props) => {
    const [leagueID, setLeagueID] = useState(props.leagueID);
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setemail] = useState("");
    const [userType, setUserType] = useState(props.userType);
    if (userType === undefined)
        setUserType("player");


    const { signup, error } = useSignup();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestBody = { leagueID, fname, lname, username, password, email, userType };
        await signup(requestBody);

        if (localStorage.getItem('user'))
            navigate('/home');

    }

    const cancel = async () => {
        //TODO: axios call to delete league
        navigateLogin();
    }

    const navigateLogin = () => {
        navigate('/');
    }

    const navigateCreateLeague = () => {
        navigate('/create-league');
    }


    return (
        <div className="container border rounded-1">
            <form className="signupForm" id="signupForm" onSubmit={handleSubmit} style={{ "padding": "10px" }}>
                <div className='row'>
                    <div className='col'>
                        <label>First Name</label>
                        <input type="text" className='form-control' onChange={(event) => setFName(event.target.value)}>
                        </input>
                    </div>
                    <div className='col'>
                        <label>Last Name</label>
                        <input type="text" className='form-control' onChange={(event) => setLName(event.target.value)}>
                        </input>
                    </div>
                </div>

                <div className='row'>
                    <div className='col'>
                        <label>Username</label>
                        <input type="text" autoCapitalize='none' className='form-control' onChange={(event) => setUsername(event.target.value)}>
                        </input>
                    </div>
                    <div className='col'>
                        <label>Email Address</label>
                        <input type="email" className='form-control' onChange={(event) => setemail(event.target.value)}>
                        </input>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Password</label>
                        <input type="password" className='form-control' onChange={(event) => setPassword(event.target.value)}>
                        </input>
                    </div>
                    <div className='col'>
                        <label>League Code</label>
                        <input type="text" className='form-control' defaultValue={leagueID} disabled={props.newLeague} onChange={(event) => setLeagueID(event.target.value)}>
                        </input>
                    </div>
                </div>
                <br />
                {/*if user didn't get to signup form from createLeague form */}
                {!props.newLeague ?
                    <div className='row'>
                        <div className='col-4'>
                            <button type="submit" className='btn btn-primary text-nowrap'>Sign Up</button>
                        </div>
                        <div className='col-3'>
                            <button type="button" className='btn btn-outline-primary text-nowrap' onClick={navigateLogin}>Login</button>
                        </div>
                        <div className='col-4'>
                            <button type="button" className='btn btn-outline-primary text-nowrap' onClick={navigateCreateLeague}>Create A League</button>
                        </div>
                    </div>

                    :

                    <div className='row'>
                        {/*if this form rendered because user created league first */}
                        <div className='col'>
                            <button type="submit" className='btn btn-primary text-nowrap'>Create League</button>
                        </div>
                        <div className="col">
                            <button onClick={cancel} className='btn btn-outline-danger text-nowrap'>Cancel</button>
                        </div>
                    </div>
                }

            </form>
            {error && <div className='errorMessage'>{error}</div>}
        </div>
    );
}

export default SignupForm;