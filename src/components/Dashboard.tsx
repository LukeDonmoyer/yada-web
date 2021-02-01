import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { fireAuthSignOut } from '../FireConfig';
import store from '../store/store';
import authSlice from '../store/FireActions';

export default function Dashboard() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();

  
  function signoutHandler() {
    fireAuthSignOut().then(() => {
      store.dispatch(authSlice.actions.logout());
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
