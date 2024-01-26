import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Feedback = () => {

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [subject, setSubject] = useState(null);
    const [message, setMessage] = useState(null);

    const [error, setError] = useState(null)

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }


    const handleSubmit = async (event) => {

        event.preventDefault();

        // const name = document.getElementById('feedback-name');
        // const email = document.getElementById('feedback-email');
        // const subject = document.getElementById('feedback-subject');
        // const message = document.getElementById('feedback-message');

        const requestBody = { name, email, subject, message }

        console.log(requestBody);

        //axios post request

        await axios.post('/api/user/submit-feedback', requestBody)
            .then(response => {
                setError(response.data.errorMessage);
                setTimeout(navigate, 3500, '/');
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
        
        

    }
    return (
        <div className='container'>

            <Form>
                <Form.Group className='mb-3 col-md-6'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control id='feedback-name' placeholder='Name' onChange={event => setName(event.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3 col-md-6'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control id='feedback-email' placeholder='Email' onChange={event => setEmail(event.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3 col-md-6'>
                    <Form.Label>Subject</Form.Label>
                    <Form.Control id='feedback-subject' placeholder='Subject' onChange={event => setSubject(event.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Message</Form.Label>
                    <Form.Control id='feedback-message' as='textarea' placeholder='Message' rows={4} onChange={event => setMessage(event.target.value)} />
                </Form.Group>


            </Form>
            <div className='row'>
                <div className='col'>
                    <Button variant="primary" onClick={handleSubmit}>Submit Issue/Feedback</Button>
                </div>
                <div className='col text-end'>
                    <Button variant="outline-primary" onClick={goBack}>Go Back</Button>
                </div>

            </div>

            <br />
            {error && 
                <div>{error} - Navigating back to home page</div>
            }
        </div>

    )
}

export default Feedback;