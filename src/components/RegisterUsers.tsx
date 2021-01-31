import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../assets/styles.scss";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { getUserData } from "FireConfig";

export default function RegisterUsers() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();
  try {
    let uid = currentUser.uid;
    // alert(uid)
    getUserData(uid).then((data) => {
      if (data.userGroup === "Power" || data.userGroup === "User") {
        alert("innappropriate permissions. Please log in as administrator.");
        history.push("/dashboard");
      }
    });
    // check
  } catch (e) {
    // alert(e);
    history.push("/?redirect=registerUsers");
  }
  return (
    <div className="h-screen">
      <div className="floatingCard cardSmall">
        <h1>Register users</h1>
      </div>
    </div>
  );
}
