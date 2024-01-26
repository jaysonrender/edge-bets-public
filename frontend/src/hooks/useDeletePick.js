import { useState } from 'react';

import axios from 'axios';

export const useDeletePick = () => {
    const [error, setError] = useState(null);

    const deletePick = async ({userToken, userID, pickWeek, pick, flexPickStatus}) => {

        const url = `/api/pick/deletePick/${userID}/${pickWeek}/${pick}/${flexPickStatus}`;
        console.log(url)

        await axios.delete(url, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        }).then(response => setError(response.data.message))
            .catch((error) => {
                setError(error.response.data.message);
            });
    }

    return { deletePick, error, setError };

}

