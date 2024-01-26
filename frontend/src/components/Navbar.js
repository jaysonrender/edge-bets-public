import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useUserContext } from '../hooks/useUserContext';
import AccountInfo from './AccountInfo';
import Rules from './Rules';
import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';





const MyNavbar = () => {
    const { logout } = useLogout();
    const { userID, userType } = useUserContext();
    const [expanded, setExpanded] = useState(false);

    //for some reason, navbar keeps expanding when a user logs in and I can't figure out , this useEffect negates that
    useEffect(()=>{
        setExpanded(false);
    }, [userID]);

    const handleClick = () => {
        logout();
    }
    const HelpTab = () => {
        return (
            <ul className='navbar-nav'>
                <li className='nav-item dropdown '>
                    <Link className="nav-link dropdown-toggle" role='button' data-bs-toggle="dropdown">Help</Link>
                    <ul className='dropdown-menu text-bg-secondary'>
                        <li><Link className='dropdown-item text-bg-secondary' data-bs-toggle='modal' data-bs-target='#rules'>Rules</Link></li>
                        <li><Link className='dropdown-item text-bg-secondary'>FAQs</Link></li>
                        <li><Link className='dropdown-item text-bg-secondary' to='/submit-feedback' onClick={() => setExpanded(false)}>Report Issue/Submit Feedback</Link></li>
                    </ul>
                </li>
            </ul>
        )
    }

    return (
        <>
            <div className="container navBarContainer text-bg-dark" >
                <Navbar expand='md' expanded={expanded} className="navbar navbar-expand-md navbar-dark">
                    {!userID && (
                        <div className='container'>
                            <Link className='navbar-brand' to='/'>Edge Bets</Link>
                            <HelpTab />

                        </div>)}
                    {(userID) && (
                        <Container>
                            <Navbar.Brand href='/'>Edge Bets</Navbar.Brand>
                            <Navbar.Toggle aria-controls='responsive-navbar-nav'
                                onClick={() => setExpanded(expanded ? false : 'expanded')} />
                            <Navbar.Collapse id='responsive-navbar-nav'>
                                <Nav className='me-auto'>
                                    <Link className='nav-link text-nowrap' to="/home" onClick={() => setExpanded(false)}>Home</Link>
                                    <Link className='nav-link text-nowrap' to='/standings' onClick={() => setExpanded(false)}>Standings</Link>
                                    <Link className='nav-link text-nowrap' to="/games" onClick={() => setExpanded(false)}>Schedule</Link>
                                    <Link className='nav-link text-nowrap' to='/user/my-picks' onClick={() => setExpanded(false)}>My Picks</Link>
                                    <Link className='nav-link text-nowrap' to="/submit-picks" onClick={() => setExpanded(false)}>Submit Pick</Link>
                                    {(userType === 'admin' || userType === 'root') &&
                                    <Link className='nav-link text-nowrap' to="/manage-league" onClick={() => setExpanded(false)}>Manage My League</Link>
                                    }
                                    <HelpTab />
                                    <AccountInfo onClick={() => setExpanded(false) }/>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    )}
                </Navbar>
                <Rules />
            </div>

            </>
    )
}

export default MyNavbar;