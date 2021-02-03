/**
 * Dashboard component
 * author: Shaun Jorstad
 * 
 * route: '/dashboard'
 * purpose: currently displays the logged in user's UID and provides a button to log out
 */

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../store/rootReducer";
import { fireAuthSignOut } from "../FireConfig";
import AuthCheck from './AuthCheck';

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const history = useHistory();

  /**
   * signs out the user and then redirects to the home page
   */
  function signoutHandler() {
    fireAuthSignOut().then(() => {
      history.push("/");
    });
  }

  // if there is no logged in user redirect home
  if (currentUser === null || currentUser === undefined) {
    return <AuthCheck/>
    // history.push("/");
  }

  return (
    <div>
      <h1>Dashboard: </h1>
      <p>logged in user: </p>
      <p>{JSON.stringify(currentUser)}</p>
      <div
        className="primaryButton smallButton"
        onClick={() => {
          signoutHandler();
        }}
      >
        sign out
      </div>
    </div>
  );
}
