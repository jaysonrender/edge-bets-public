import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {useUserContext} from './hooks/useUserContext';

import Home from './pages/Home';
import Games from './pages/Games';
import Standings from './pages/Standings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserPicks from './pages/UserPicks';
import ForgotPassword from './pages/ForgotPassword';
import ManageLeague from './pages/ManageLeague';
import Feedback from './pages/Feedback';

import PickForm from './components/PickForm';
import Navbar from './components/Navbar';
import LeagueForm from './components/LeagueForm';
import ResetPassword from './pages/ResetPassword';


 
function App() {

  const {userToken} = useUserContext();
 

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
          <Routes>

            {/*if a valid userToken is present, user has access to home, games, picks, standings, etc otherwise they are redirected to login pages */}
            <Route path='/' element={!userToken ? <Login /> : <Navigate to='/home' />} />
            
            <Route path='/signup' element={!userToken ? <Signup /> : <Navigate to='/home' />} 
            />
            <Route path="/create-league" element={!userToken ? <LeagueForm /> : <Navigate to='/home' />}
            />
            <Route path='/home' element={userToken ? <Home /> : <Navigate to='/' />}
            />
            <Route path="/games" element={userToken ? <Games /> : <Navigate to='/' />} 
            />
            <Route path='/user/my-picks' element={userToken ? <UserPicks /> : <Navigate to='/' />}
            />
            <Route path="/submit-picks" element = {userToken ? <PickForm /> : <Navigate to='/'/>} 
            />
            <Route path='/standings' element = {userToken ? <Standings /> : <Navigate to='/' />}
            />
            <Route path='/forgot-password' element= {<ForgotPassword />} 
            />
            <Route path = 'reset-password/:userID/:token' element = {<ResetPassword />} />
            <Route path = '/manage-league' element = { userToken ? <ManageLeague /> : <Navigate to='/' />} />
            <Route path = '/submit-feedback' element = {<Feedback />} />
          </Routes>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
