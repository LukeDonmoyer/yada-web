/**
 * Auth verification form component
 * author: Shaun Jorstad
 *
 * fullscreen component to request signin from the user
 */
import { Button, Form, Input } from 'reactstrap';
import {
    sendPasswordResetEmail,
    signInWithEmail,
} from 'scripts/Datastore';
import { Animated } from 'react-animated-css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AuthCheckProps {
    additionalMessage?: string;
}

export default function AuthCheck(props: AuthCheckProps) {
    const [email, updateEmail] = useState('');

    /**
     * Attempts to authenticate with the provided parameters
     * @param event Synthetic event
     */
    const handleLogin = (event: any) => {
        event.preventDefault(); // prevents form default submission
        const email = event.currentTarget[0].value;
        const password = event.currentTarget[1].value;
        signInWithEmail(email, password); // attempts to sign in with credentials
    };

    /**
     * sends password reset email to the email address in the email input
     */
    function passwordResetHandler() {
        // prompts user to confirm email
        if (window.confirm(`send password reset email to ${email}`)) {
            sendPasswordResetEmail(email); // sends reset email
        }
    }

    return (
        <Animated animationIn="fadeIn" animationOut="fadeOut" isVisible={true}>
            <div className="h-screen authCheck">
                <div className="card">
                    <h1>Sign In</h1>
                    {/* Shows additional message if provided in props */}
                    {props.additionalMessage ? (
                        <p>{props.additionalMessage}</p>
                    ) : (
                        <p></p>
                    )}
                    {/* login form */}
                    <Form onSubmit={handleLogin}>
                        <Input
                            required
                            type="email"
                            name="email"
                            id="email"
                            placeholder="email"
                            onChange={(event) => {
                                updateEmail(event.currentTarget.value);
                            }}
                        />
                        <Input
                            required
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                        />
                        <Button type="submit" value="Submit">
                            Sign In
                        </Button>
                        <Link to="/request-account" className="requestLink">
                            Request Account
                        </Link>
                        <div
                            className="passwordResetLink"
                            onClick={passwordResetHandler}
                        >
                            Request password reset
                        </div>
                    </Form>
                </div>
            </div>
        </Animated>
    );
}
