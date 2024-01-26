import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import getCurrentWeek from '../util/getCurrentWeek';
import WeekOptions from './WeekOptions';
import FlexWarningModal from './FlexWarningModal';
import { useUserContext } from '../hooks/useUserContext';
import { useSubmitPick } from '../hooks/useSubmitPick';
import { useLogout } from '../hooks/useLogout';

const PickForm = () => {

    const [pickWeek, setPickWeek] = useState(null); //TODO: reset to getCurrentWeek() at start of season;
    const [pick1, setPick1] = useState(null);
    const [pick2, setPick2] = useState(null);
    const [games, setGames] = useState(null);
    const [flexPickStatus, setFlexPickStatus] = useState(null);
    const [flexPicksRemaining, setRemainingFlex] = useState(null);
    const [picksThisWeek, setPicksThisWeek] = useState([null, null]);
    const [showFlexWarning, setShow] = useState(false);

    const [weekLabel, setWeekLabel] = useState('Pick Week')
    const [pick1Label, setPick1Label] = useState('Pick 1');
    const [pick2Label, setPick2Label] = useState('Pick 2');

    const { submitPick, error, setError } = useSubmitPick();
    const { leagueID, userID, userToken } = useUserContext();
    const navigate = useNavigate();
    const {logout} = useLogout();

    const handlePicks = async (e) => {
        
        e.preventDefault();
        console.log(picksThisWeek, ", ", pick1, ", ", pick2);

        //if one pick has been made for the week       
        if(picksThisWeek[0] !== null && picksThisWeek[1] === null) {
            //compare and validate against pick1
            if(await compareAndValidatePicks(picksThisWeek[0], pick2)){
                setPick1(picksThisWeek[0]);
                setShow(true);
            }
            
            
        }

        //if no picks have been made
        else if (picksThisWeek[0] === null && picksThisWeek[1] === null) {
            if(pick1 !== null && pick2 === null) {
                console.log('A')
                if(await compareAndValidatePicks(pick1, null))
                    setShow(true);
                

            }
            else if (pick1 === null && pick2 !== null){
                setPick1(pick2);
                setPick2(null);

                
                if (await compareAndValidatePicks(pick1, pick2))
                    setShow(true);
                         
            } else {
                
                if(await compareAndValidatePicks(pick1, pick2))
                    setShow(true);

            }
        }   
        
        
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const autoPickStatus = (pick2 === null) ? 1 : 0;
        await submitPick({ userToken, userID, pickWeek, pick1, pick2, flexPickStatus, autoPickStatus });
        setShow(false);
        navigate('/user/my-picks');


    }

    const resetPicks = () => {
        document.getElementById('pickForm').reset();
        setWeekLabel('Pick Week');
        setPickWeek(null);
        setPick1(null);
        setPick1Label('Pick 1');
        setPick2(null);
        setPick2Label('Pick 2');
        setFlexPickStatus(0);
        setShow(false);
    }
    
    async function compareAndValidatePicks(pick1, pick2){
        if (isSameGame(pick1, pick2)) {
            setError('You cannot pick two teams that are playing against each other');
            return false;
        }
        else if (pick1 === pick2) {
            console.log(pick1, pick2);
            setError('You must pick two seperate teams');
            return false;
        }
        else {
            const duplicates = await findDuplicatePick();
            setFlexPickStatus(duplicates);
            
            return true;
        }
    }
    
    async function findDuplicatePick() {

        const url = `/api/pick/userPicks/${userID}`;
        const { data } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        let count = 0;


        if (data.some(pick => pick1 !== null && (pick1 === pick.pick1 || pick1 === pick.pick2) && (pick.pick_week !== pickWeek))) {
            console.log(pick1)
            count++;
        }

        if (data.some(pick => pick2 !== null && (pick2 === pick.pick1 || pick2 === pick.pick2))) {
            console.log(pick2)
            count++;
        }

        return count;

    }

    function isSameGame(pick1, pick2) {
        for (const game of games) {
            if ((pick1 === game.home && pick2 === game.away) ||
                (pick2 === game.home && pick1 === game.away))

                return true;
        }

        return false;
    }


    useEffect(() => {

        const fetchGames = async () => {
            const currentDate = new Date();
            const url = `/api/pick/games/${pickWeek}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                if(error.response.status === 401)
                    logout();
                
            });
            
            const filteredGames = data.filter((game) => new Date(game.game_time) > currentDate)
            setGames(filteredGames);
        }

        const getRemainingFlexPicks = async () => {
            const url = `/api/pick/stats/${leagueID}/${userID}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error);
            });

            setRemainingFlex(data.flexPicks);
        }

        const getPicksThisWeek = async () => {
            // axios call /api/pick/userID/week
            const url = `/api/pick/userPicks/${userID}/${pickWeek}`;
            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            }).catch((error) => {
                console.log(error);
            });

            if (data.length > 0) {
                const picks = [data[0].pick1, data[0].pick2];

                setPicksThisWeek(picks);

            }
            else {
                setPicksThisWeek([null, null]);
            }


        }

        fetchGames();
        getRemainingFlexPicks();
        getPicksThisWeek();

    }, [pickWeek, userToken, userID, leagueID]);


    let weekOptions = [];
    weekOptions.push({ value: null, label: 'Pick Week' });
    const currentWeek = getCurrentWeek(new Date());
    let i = (currentWeek >= 1) ? currentWeek : 1;
    for (i; i <= 18; i++) {
        weekOptions.push({ value: i, label: `Week ${i}` });
    }

    let pickOptions = [];
    if (games) {
        for (const game of games) {
            pickOptions.push({ value: game.home, label: `${game.home} - ${game.home_name} (vs ${game.away})` });
            pickOptions.push({ value: game.away, label: `${game.away} - ${game.away_name} (@ ${game.home})` });
        }
        pickOptions.sort((a, b) => {
            if (a.value < b.value) return -1;
            if (a.value > b.value) return 1;
            return 0;
        });

        pickOptions.push({ value: null, label: 'None' });
    }


    return (
        < >
            <div className="container pickFormContainer">
                <form className='pickForm' id="pickForm" >
                    <h3>Submit A Pick</h3>
                    <label>Week</label>
                    <Select id='pickWeek' value={{ value: pickWeek, label: weekLabel }}  options={weekOptions} isSearchable={false} onChange={(selectedOption) => {
                        setPickWeek(selectedOption.value);
                        setWeekLabel(selectedOption.label);
                        setPick1(null);
                        setPick1Label('Pick 1');
                        setPick2(null);
                        setPick2Label('Pick 2');
                        }
                    } />

                    <br />
                    <label>Pick 1 </label>
                    <Select id='pick1' 
                        options={pickOptions} 
                        value={picksThisWeek[0] ? {label: picksThisWeek[0]} : { value: pick1, label: pick1Label }} 
                        isDisabled={picksThisWeek[0]} 
                        isSearchable={false} 
                        onChange={(selectedOption) => {
                            setPick1(selectedOption.value);
                            setPick1Label(selectedOption.label);
                        }
                    } />

                    <br />
                    <label>Pick 2 </label>
                    <Select id='pick2' 
                        options={pickOptions} 
                        value={picksThisWeek[1] ? {label: picksThisWeek[1]} :{ value: pick2, label: pick2Label }} 
                        isDisabled={picksThisWeek[1]} 
                        isSearchable={false} 
                        onChange={(selectedOption) => {
                            setPick2(selectedOption.value);
                            setPick2Label(selectedOption.label);
                        }
                    } />
                    <br />
                    <button className='mr-2 btn btn-primary' disabled={(picksThisWeek[0] && picksThisWeek[1] )} type='button' onClick={handlePicks}>Submit Pick</button>
                    <button className='mx-2 btn btn-danger' onClick={resetPicks}>Reset Form</button>
                    
                </form>
                {error && <div>{error}</div>}


            </div>
            
            <FlexWarningModal
                show={showFlexWarning}
                onHide={() => setShow(false)}
                flexPickStatus={flexPickStatus}
                flexPicksRemaining={flexPicksRemaining}
                resetPicks={resetPicks}
                handleSubmit={handleSubmit}
                pickWeek={pickWeek}
                pick1={pick1}
                pick2={pick2}
            />



        </>
    )
}

export default PickForm;