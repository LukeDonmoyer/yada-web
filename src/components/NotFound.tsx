import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 component. Includes some links back to other pages.
 *
 * @constructor
 */
export default function NotFound(): ReactElement {
    return (
        <div className="notFound h-screen">
            <div className="card grid grid-cols-2 md:grid-cols-2">
                <div className="grid justify-items-start gap-4">
                    <li>
                        <Link to="/">Sign In</Link>
                    </li>
                    <li>
                        <Link to="/app">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/contact-us">Contact Us</Link>
                    </li>
                    <li>
                        <Link to="/request-account">Request Account</Link>
                    </li>
                </div>
                <div>
                    <div className="grid justify-items-end flex items-center">
                        <h1>404</h1>
                        <h2>Page Not Found</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
