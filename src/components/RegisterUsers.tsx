import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../assets/styles.scss";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { getUserData } from "FireConfig";
import { forEachChild } from "typescript";

export default function RegisterUsers() {
  const [numForms, setForms]: [number, any] = useState(1);
  const [emails, setEmails]: [string[], any] = useState([]);

  function addForm() {
    setForms(numForms + 1);
  }

  function updateEmail(index: number, newValue: string) {
    let oldEmails = [...emails];
    oldEmails[index] = newValue;
    setEmails(oldEmails);
  }

  function registerUsers() {
    
  }

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
      <div className="floatingCard cardLarge">
        <h1>Register users</h1>
        <div className="userForms">
          <h3 className="float-left">Emails:</h3>
          <div onClick={addForm} className="primaryButton  float-right">
            +
          </div>
          <div className="registerUsersTable">
            {Array.from({ length: numForms }, (x, i) => i).map((i) => (
              <input
                key={i}
                onChange={(event) => {updateEmail(i, event.target.value)}}
                className="simpleInput"
                type="email"
                placeholder="email"
              />
            ))}
          </div>
          <div
            className="primaryButton registerUsersButton"
            onClick={registerUsers}
          >
            register and email
          </div>
        </div>
      </div>
    </div>
  );
}
