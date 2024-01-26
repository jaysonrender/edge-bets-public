import { useState } from 'react';

import axios from 'axios';


export const useSubmitPick = () => {
    const [error, setError] = useState(null)

    const submitPick = async ({ userToken, userID, pickWeek, pick1, pick2, flexPickStatus, autoPickStatus }) => {

        const requestBody = { userID, pickWeek, pick1, pick2, flexPickStatus, autoPickStatus };

        await axios.post(`/api/pick/submitPick`, requestBody, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        }).then(response => setError(response.data.message))
            .catch((error) => {
                setError(error.response.data.message);
            });

    }

    return { submitPick, error, setError }
}

