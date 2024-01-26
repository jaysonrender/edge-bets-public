import Leaderboard from "../components/Leaderboard";
import UserStats from "../components/UserStats";
import { useUserContext } from "../hooks/useUserContext";
const Home = () => {
    const { username } = useUserContext();
    return (
        <div className="container border">
            <h2>Hello, {username}! </h2>
            <div className="container border">
                <div className="row">
                    <div className="col">
                        <UserStats />
                    </div>

                </div>
                <div className='row'>
                    <div className="col-md-6">
                        <h2>Leaderboard</h2>
                        {/*TODO: Create component that displays players in 1st, 2nd, 3rd, and last place as well as player closest to zero*/}
                        <Leaderboard />
                    </div>
                    {/* <div className="col">
                        <h2>Upcoming Games</h2>
                        {/*TODO: Use GameDetails to display upcoming games in current NFL week 
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default Home;