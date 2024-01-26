import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios'
import ContactListTable from '../components/ContactListTable';
import { useUserContext } from "../hooks/useUserContext";
import { useLogout } from '../hooks/useLogout';

const ManageLeague = () => {
    const { userType, leagueID, userToken } = useUserContext();
    const { logout } = useLogout();
    const [error, setError] = useState(null);

    const [leagueRoster, setLeagueRoster] = useState(null);
    const [emailList, setEmailList] = useState(null);

    

    useEffect(() => {
        

        fetchLeagueRoster();
    }, []);

    const fetchLeagueRoster = async () => {
        const url = `/api/pick/leagueRoster/${leagueID}`;

        const { data } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        }).catch((error) => {
            if (error.response.status === 401)
                logout();
        });

        setLeagueRoster(data);
        setEmailList(data.map(user => user.email));
    }

    const handleClick = () => {
        navigator.clipboard.writeText(emailList).then(() => alert('Copied all emails to clipboard'));
    }

    const handleSaveChanges = async () => {

        
        const checkboxes = document.getElementsByName('paidStatusCheckbox');
        const selectedCheckboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked === true);
        const unselectedCheckboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked === false);
        const paid = selectedCheckboxes.map((checkbox) => checkbox.value);
        const unpaid = unselectedCheckboxes.map((checkbox) => checkbox.value);

        console.log(paid);
        console.log(unpaid);

        //editPaidStatus
        const requestBody = { paid, unpaid };
        await axios.post('/api/pick/editPaidStatus', requestBody, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        }).then((response) => {
            if (response.status === 200)
                setError(response.data.errorMessage)
        }).catch((error) => {
            if (error.response.status === 400)
                setError(error.response.data.errorMessage);
        });
        fetchLeagueRoster();

        // setTimeout(3000, window.location.reload())

    }

    return (
        <div className="container">
            {(userType === 'admin' || userType === 'root') &&
                <div>
                    <div>
                    <h3>Manage My League</h3>
                    <br />
                    <button className = 'me-5' onClick={handleClick}>Copy All Email Addresses to Clipboard</button>
                    <button className = 'me-5' type='button' onClick={handleSaveChanges}>Save Changes</button>
                    
                    <br />
                    {error && <span>{error}</span>}
                    </div>
                    
                    <br />
                    <div>
                    {leagueRoster &&
                        <>
                            <ContactListTable leagueRoster={leagueRoster} />
                        </>

                    }
                    <br />
                    </div>
                </div>
            }
        </div>

    );
}

export default ManageLeague;