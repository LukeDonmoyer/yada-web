import { useEffect, useState } from 'react';
import 'assets/tailwind.css';
import 'assets/styles.scss';
import Onboard from './components/Onboard/Onboard';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ChangePassword from 'components/Onboard/ChangePassword';
import ContactUs from 'components/Onboard/ContactUs';
import RequestAccount from 'components/Onboard/RequestAccount';

import authSlice from 'store/FireActions';
import store from './store/store';
import Sites from 'components/Site/Sites';
import Settings from 'components/UserSettings';
import NotFound from 'components/NotFound';
import { RootState } from 'store/rootReducer';
import { useSelector } from 'react-redux';
import AuthCheck from 'components/Control/AuthCheck';
import { Animated } from 'react-animated-css';
import StaticNavbar, { StaticNavItem } from 'components/Control/StaticNavbar';
import Dashboard from 'components/Dashboard/Dashboard';
import UserManagement from 'components/UserManagement';
import homeIcon from 'assets/icons/home.svg';
import sitesIcon from 'assets/icons/site.svg';
import settingsIcon from 'assets/icons/settings.svg';
import usersIcon from 'assets/icons/accountManagement.svg';
import {
    getUserPrivilege,
    initializeListeners,
    registerAuthChangeCallback,
    resetRedux,
} from './scripts/Datastore';

function App() {
    const currentUser = useSelector((state: RootState) => state.auth.userUID);
    const [userPrivilege, setPrivilege] = useState('User');

    // Setup listeners and get user privilege after authentication
    useEffect(() => {
        registerAuthChangeCallback((userAuth: any) => {
            store.dispatch(authSlice.actions.login(userAuth?.uid));
            if (userAuth !== null && userAuth !== undefined) {
                initializeListeners();
            } else {
                resetRedux();
            }

            getUserPrivilege().then((privilege: string) => {
                setPrivilege(privilege);
            });
        });
    }, []);

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={Onboard} />
                <Route path="/app">
                    {/* Shows simple signin component on routes where the user is not authenticated */}
                    {currentUser === null || currentUser === undefined ? (
                        <AuthCheck />
                    ) : (
                        <Animated
                            animationIn="fadeIn"
                            animationOut="fadeOut"
                            isVisible={true}
                        >
                            <div className={'app'}>
                                {/* Component that renders each link in the static navbar as a nested route */}
                                <StaticNavbar
                                    autoCollapse={true}
                                    roundRightCorners={true}
                                    currentPrivilege={userPrivilege}
                                >
                                    {/* Dashboard route */}
                                    <StaticNavItem
                                        label={'Dashboard'}
                                        route={'dashboard'}
                                        icon={homeIcon}
                                    >
                                        <Dashboard />
                                    </StaticNavItem>
                                    {/* Sites route */}
                                    <StaticNavItem
                                        label={'Sites'}
                                        route={'sites'}
                                        icon={sitesIcon}
                                    >
                                        <Sites />
                                    </StaticNavItem>
                                    {/* Route disabled because this component has not been created yet */}
                                    {/* <StaticNavItem
                                            label={'channel templates'}
                                            route={'channel-templates'}
                                            icon={templatesIcon}
                                        >
                                            <ChannelTemplates />
                                        </StaticNavItem> */}
                                    {/* User management route: conditionally rendered if User is an owner or an admin */}
                                    {['Owner', 'Admin'].includes(
                                        userPrivilege
                                    ) ? (
                                        <StaticNavItem
                                            label="User Management"
                                            route="usermanagement"
                                            icon={usersIcon}
                                        >
                                            <UserManagement />
                                        </StaticNavItem>
                                    ) : (
                                        <></>
                                    )}
                                    {/* User settings route */}
                                    <StaticNavItem
                                        label="Settings"
                                        route="settings"
                                        icon={settingsIcon}
                                    >
                                        <Settings />
                                    </StaticNavItem>
                                </StaticNavbar>
                            </div>
                        </Animated>
                    )}
                </Route>
                {/* singular component to change user's password, required on first login */}
                <Route path="/change-password">
                    <ChangePassword />
                </Route>
                {/* contact us form */}
                <Route path="/contact-us">
                    <ContactUs />
                </Route>
                {/* request account form */}
                <Route path="/request-account">
                    <RequestAccount />
                </Route>
                {/* 404 error */}
                <Route path={'*'} component={NotFound} />
            </Switch>
        </Router>
    );
}

export default App;
