import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import authTypes from "store/reducers/auth/authTypes";
import { fireAuthSignOut } from '../FireConfig';

export default function Dashboard() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();

  
  function dispatchLogout() {
    dispatch({
      type: authTypes.CLEAR_CURRENT_USER,
      payload: null
    });
  }

  function signoutHandler() {
    fireAuthSignOut().then(() => {
        dispatchLogout();
    })
  }

  if (currentUser === null) {
    //   change route to homepage
    history.push('/')
  }
  return (
    <div>
      <h1>Dashboard: </h1>
      <p>logged in user: </p>
      <p>{JSON.stringify(currentUser)}</p>
      <div className="primaryButton smallButton" onClick={() => {signoutHandler();}} >
          sign out
      </div>
    </div>
  );
}
