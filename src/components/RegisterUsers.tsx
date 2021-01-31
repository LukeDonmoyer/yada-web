import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../assets/styles.scss";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { createUserDocument, getUserData } from "FireConfig";
import { forEachChild } from "typescript";
import { registerUser } from "FireAdmin";

export default function RegisterUsers() {
  const [numForms, setForms]: [number, any] = useState(0);
  const [emails, setEmails]: [string[], any] = useState([]);

  function addForm() {
    setForms(numForms + 1);
  }

  function updateEmail(index: number, newValue: string) {
    let oldEmails = [...emails];
    oldEmails[index] = newValue;
    setEmails(oldEmails);
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

  function registerUsers() {
    emails.forEach((email) => {
      registerUser(currentUser.uid, email).then((user) => {
        // alert(user.data().uid)
        console.log("results");
        console.log(user);
        createUserDocument(user.user.uid, user.user.email, "User");
      });
    });
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
                onChange={(event) => {
                  updateEmail(i, event.target.value);
                }}
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
