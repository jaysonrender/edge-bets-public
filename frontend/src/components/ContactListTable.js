import Table from 'react-bootstrap/Table';

const ContactListTable = (props) => {
    const leagueRoster = props.leagueRoster;

    const ContactListRows = () => {

        let rows = leagueRoster.map((player) => {
            return (
                <tr>
                    <td>{player.user_id}</td>
                    <td>{player.fname}</td>
                    <td>{player.lname}</td>
                    <td>{player.username}</td>
                    <td>{player.email}</td>
                    <td><input className="form-check-input" name='paidStatusCheckbox' value={player.user_id} type="checkbox" defaultChecked={player.paid_status} /></td>
                </tr>
            )
        })
        return rows;
    }

    return (
        <div className='overflow-auto '>
            <Table striped bordered hover size='sm'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Paid Status</th>

                    </tr>
                </thead>
                <tbody>
                    <ContactListRows />
                </tbody>
            </Table>
        </div>
    )
}

export default ContactListTable