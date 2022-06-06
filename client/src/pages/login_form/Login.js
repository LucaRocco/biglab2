import { Form, Row, Container, Col, Alert, Button } from "react-bootstrap";
import { useState } from "react";

/* Regex email format validation */
function isEmailValid(mail) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}


function Login(props) {
    const [username, setUsername] = useState('john.doe@polito.it');
    const [password, setPassword] = useState('password');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        if (!isEmailValid(username)) {
            setErrorMessage('Email format not valid');
            return;
        }

        if(password === '') {
            setErrorMessage("Password is mandatory");
            return;
        }

        props.login(credentials)
            .catch(async err => {
                setErrorMessage(err.message);
            })
    }

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Login</h2>
                    <Form>
                        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                        <Form.Group controlId='username'>
                            <Form.Label>email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <Button type='submit' onClick={handleSubmit}>Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}


export default Login;