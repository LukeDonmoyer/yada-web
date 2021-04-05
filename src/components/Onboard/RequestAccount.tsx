/**
 * Request Account page component. 
 * 
 * This component returns a page containing a form that allows the user to send a message
 * requesting an account, along with an email address, to the administrators/owners of the database.
 * 
 * Author: Brendan Ortmann
 */
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Input } from 'reactstrap';
import { createEmailDocument } from '../../scripts/Datastore';

export default function RequestAccount() {
    let [email, setEmail] = useState('');
    let [message, setMessage] = useState('');
    let [submitted, setSubmitted] = useState(false);
    let [dialog, setDialog] = useState(false);

    /**
     * Handles state changes on the page.
     * @param func is the function which updates the associated stateful value.
     */
    function handleEvent(func: any) {
        return (event: any) => {
            event.preventDefault();
            func(event.target.value);
        };
    }

    /**
     * Adds an Email document to the Firestore database.
     * @param event
     */
    const sendEmail = (event: any) => {
        createEmailDocument(email, message, 'YADA Request Account');
        setDialog(true);
    };

    const toOnboard = () => setSubmitted(true);

    /**
     * Redirects to the Sign In page if the form has been submitted, otherwise serves the page again.
     */
    return submitted ? (
        <Redirect push to="/" />
    ) : (
        <div className="requestAccount h-screen">
            <div className="card">
                <h1>Request Account</h1>
                <Form onSubmit={sendEmail} className="py-8">
                    <Input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleEvent(setEmail)}
                    />
                    <Input
                        required
                        type="textarea"
                        name="textarea"
                        id="textarea"
                        rows="4"
                        placeholder="Message"
                        value={message}
                        onChange={handleEvent(setMessage)}
                    />
                    <Button
                        type="submit"
                        value="Submit"
                        className="primaryButton"
                    >
                        Request Account
                    </Button>
                </Form>
            </div>
        </div>
    );
}
