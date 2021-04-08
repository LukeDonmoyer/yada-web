/**
 * Onboarding component
 *
 * route: '/'
 * purpose: home page with an info carousel that provides the login form and some links to resources.
 */

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { Button, Form, Input } from 'reactstrap';
import {
    signInWithEmail,
    getUserData,
    sendPasswordResetEmail,
} from '../../scripts/Datastore';

import AnimatedLogo from './AnimatedLogo';

import { RootState } from '../../store/rootReducer';

function SignInForm() {
    const [email, updateEmail] = useState('');
    const handleLogin = (event: any) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        signInWithEmail(email, password);
    };

    function passwordResetHandler() {
        if (window.confirm(`send password reset email to ${email}`)) {
            sendPasswordResetEmail(email);
        }
    }

    return (
        <div className="onboardForm">
            <h1>Sign In</h1>
            <p>
                Sign in with your pre-assigned credentials. Request an account
                from the administrator with the link below.
            </p>
            <Form onSubmit={handleLogin}>
                <Input
                    required
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    onChange={(event) => {
                        updateEmail(event.target.value);
                    }}
                />
                <Input
                    required
                    type="password"
                    name="password"
                    id="password"
                    placeholder="password"
                />
                <Button>Sign In</Button>
                <Link to="/request-account" className="requestLink">
                    Request Account
                </Link>
                <div
                    className="passwordResetLink"
                    onClick={() => {
                        passwordResetHandler();
                    }}
                >
                    Request Password Reset
                </div>
            </Form>
        </div>
    );
}

/**
 * Onboard
 * @param props
 */
function Onboard(props: RouteComponentProps) {
    const currentUser = useSelector((state: RootState) => state.auth.userUID);
    const [redirectDestination, setRedirect] = useState('/');
    // if the user is logged in, they are redirected to changing their password on initial login, or are directed to the location specified by the ?redirect flag, or are directed to the dashboard
    if (!(currentUser === null || currentUser === undefined)) {
        const uid = currentUser;
        getUserData(uid).then((userData) => {
            if (userData.defaults) {
                setRedirect('/change-password');
            } else {
                let properties = props.location.search.split('=');
                if (
                    properties[0].includes('redirect') &&
                    ['change-password', 'register-users'].includes(
                        properties[1]
                    )
                ) {
                    let address = '/' + properties[1];
                    setRedirect(address);
                } else {
                    setRedirect('/app/dashboard');
                }
            }
        });
    }

    return (
        <div className="onboard">
            <div className="floatingCard">
                {!(currentUser === null || currentUser === undefined) ? (
                    <Redirect to={redirectDestination} />
                ) : (
                    <>
                        <div className="logoContainer"></div>
                        <div className="mainContainer">
                            <div className="navBar">
                                <ul>
                                    <AnimatedLogo />
                                    <li>
                                        <Link to="/contact-us">Contact Us</Link>
                                    </li>
                                    <li>
                                        <a href="https://github.com/Yet-Another-Data-Aggregator/yada-web">
                                            Open Source Code
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <SignInForm />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Onboard;
