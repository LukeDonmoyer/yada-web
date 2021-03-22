/**
 * Contact Us page component
 * Author: Brendan Ortmann
 *
 * This component returns a page containing a form that allows the user to send a message along with an email address
 * to the administrators/owners of the database.
 */
import React, { useState } from 'react';
import { Button, Form, Input } from 'reactstrap';
import { createEmailDocument } from '../../scripts/Datastore';
import { Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import "../../assets/styles.scss";
import "../../assets/bootstrap.scss";

export default function ContactUs() {
    let [email, setEmail] = useState('');
    let [message, setMessage] = useState('');
    let [submitted, setSubmitted] = useState(false);
    let [modal, setModal] = useState(false);

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
        // createEmailDocument(email, message, 'YADA Contact Us');
        // alert('Email sent!'); // TODO: Replace with Reactstrap alert?
        setModal(true);
        //setSubmitted(true);
    };

    const modalClosed = () => setSubmitted(true);
    const toggle = () => setModal(!modal);

    /**
     * Redirects to the Sign In page if the form has been submitted, otherwise serves the page again.
     */
    return submitted ? (
        <Redirect push to="/" />
    ) : (
        <div className="contactUs h-screen">
            <Modal isOpen={modal} toggle={toggle} className="bootStrapStyles">
                <ModalHeader toggle={toggle}>Email sent!</ModalHeader>
                <ModalFooter>
                    <Button onClick={toggle}>Ok</Button>
                </ModalFooter>
            </Modal>
            <div className="card">
                <h1>Contact Us</h1>
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
                    <Button type="submit" value="Submit">
                        Contact Us
                    </Button>
                </Form>
            </div>
        </div>
    );
}
