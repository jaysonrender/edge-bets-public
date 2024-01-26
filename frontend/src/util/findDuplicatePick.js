import axios from 'axios';

async function findDuplicatePick(userToken, userID, pick1, pick2) {

    const url = `/api/pick/userPicks/${userID}`;
    const { data } = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });

    let count = 0;


    if (data.some(pick => pick1 !== null && (pick1 === pick.pick1 || pick1 === pick.pick2))) {
        console.log(pick1)
        count++;
    }

    if (data.some(pick => pick2 !== null && (pick2 === pick.pick1 || pick2 === pick.pick2))) {
        console.log(pick2)
        count++;
    }

    return count;

}

export default findDuplicatePick