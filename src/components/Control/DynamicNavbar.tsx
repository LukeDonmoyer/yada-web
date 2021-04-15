/**
 * Second tier navbar
 */
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Link, Route, useLocation, useRouteMatch } from 'react-router-dom';
import { RootState } from 'store/rootReducer';
import PrivilegeAssert from './PrivilegeAssert';
interface dynamicNavLink {
    // route this link directs to
    route: string;
    // name to render for the link
    name: string;
    children: ReactElement;
    // optionally prevents rendering of a link. (used for default routes)
    blockLinkRender?: boolean;
}

/**
 * Renders navigation link
 * @param props
 * @returns
 */
export function DynamicNavLink(props: dynamicNavLink) {
    let currentRoute = useLocation();
    const { url } = useRouteMatch();

    // Determines if this link is active
    let match =
        currentRoute.pathname.split(url)[1].split('/')[1] === props.route;

    // used for default routes that shouldn't be rendered
    if (props.blockLinkRender) {
        return <></>;
    }

    return (
        <Link to={`${url}/${props.route}`}>
            <div
                className={`navItem ${
                    currentRoute.pathname.startsWith(`${url}/${props.route}`) &&
                    match
                        ? 'active'
                        : 'inactive'
                }`}
            >
                {props.name}
            </div>
        </Link>
    );
}

interface DynamicNavBarProps {
    // title to render
    title: string;
    // callback to perform on button click
    buttonAction: React.MouseEventHandler<HTMLDivElement>;
    // children links to render
    children: ReactElement | ReactElement[];
}

/**
 * Renders dynamic navbar. This navbar contains a title, an action button, and a list of children links which direct to nested routes
 * @param props
 * @returns
 */
export default function DynamicNavbar(props: DynamicNavBarProps) {
    const { path } = useRouteMatch();

    // creates route for the component passed into it
    function createRoute(child: ReactElement) {
        if (child.props.blockLinkRender) {
            return (
                <Route exact path={`${path}/${child.props.route}`}>
                    {child.props.children}
                </Route>
            );
        }
        return (
            <Route path={`${path}/${child.props.route}`}>
                {child.props.children}
            </Route>
        );
    }

    return (
        <>
            <div className="dynamicNavbar">
                <div className="navbarHeader">
                    <div className="title">{props.title}</div>
                    <PrivilegeAssert requiredPrivilege="Power">
                        <div className="addButton" onClick={props.buttonAction}>
                            +
                        </div>
                    </PrivilegeAssert>
                </div>
                {/* renders each link in children */}
                <div className="links">{props.children}</div>
            </div>
            <div className="routes">
                {/* renders route for each child */}
                {React.Children.map(props.children, createRoute)}
            </div>
        </>
    );
}
