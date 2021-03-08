import React, { ReactElement } from 'react';
import { NavLink, Route, useRouteMatch } from 'react-router-dom';

interface TabViewProps {
    // TabView Items to route between. Any element that is not a TabViewItem will be displayed in the tab view div.
    children: ReactElement | ReactElement[];
}

/**
 * Creates a tab view with the given child components.
 */
export default function TabView({ children }: TabViewProps): ReactElement {
    const { path, url } = useRouteMatch();

    /**
     * Creates a NavLink from the provided TabViewItem. If the given element is not a TabViewItem, it will
     * just return the element.
     *
     * @param child The TabVewItem to create a NavLink for or element to display.
     */
    function createLink(child: ReactElement) {
        if ((child.type as any).name !== 'TabViewItem') return child;

        return (
            <NavLink
                to={`${url}${
                    child.props.default ? '' : `/${child.props.route}`
                }`}
                exact={child.props.exact}
                className={'tab-item'}
                activeClassName={'tab-item-selected'}
            >
                {child.props.render ? child.props.render : child.props.label}
            </NavLink>
        );
    }

    /**
     * Creates a Route for the given TabViewItem. If the given element is not a TabViewItem, nothing will be returned.
     *
     * @param child The TabViewItem to create a route to.
     */
    function createRoute(child: ReactElement) {
        if ((child.type as any).name !== 'TabViewItem') return;

        return (
            <Route
                exact={child.props.exact}
                path={`${path}${
                    child.props.default ? '' : `/${child.props.route}`
                }`}
            >
                {child}
            </Route>
        );
    }

    return (
        <>
            <div className={'tab-view'}>
                {React.Children.map(children, createLink)}
            </div>
            {React.Children.map(children, createRoute)}
        </>
    );
}

interface TabViewItemProps {
    // That label for this tab item.
    label: string;

    // Determines whether this route should be exact.
    exact?: boolean;

    // The route that displays the content of this tab item.
    route?: string;

    // Determines whether this item should be shown by default. If true, route will be ignored.
    default?: boolean;

    // An optional element to be displayed instead of the label.
    render?: ReactElement;

    // The content of the tab view to be displayed when it is selected.
    children: ReactElement;
}

/**
 * Element wrapper to provide information to the TabView component.
 *
 * @constructor
 */
export function TabViewItem({ children }: TabViewItemProps): ReactElement {
    return children;
}
