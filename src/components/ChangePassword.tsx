import { changePassword, getUserData } from "FireConfig";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

import "../assets/styles.scss";

export default function ChangePassword() {
  const currentUser = useSelector((state: any) => state.auth.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();
  let uid: any = null;
  try {
    uid = currentUser.uid;
    // check
  } catch (e) {
    console.log("no logged in user, redirecting home");
    history.push("/?redirect=changePassword");
  }

  const handleResetPassword = (event: any) => {
    event.preventDefault();
    const password1 = event.target[0].value;
    const password2 = event.target[1].value;
    if (password1 !== password2) {
      alert("passwords must match");
    } else {
      changePassword(password1)?.then(
        () => {
          getUserData(uid).then((userData) => {
            if (userData.userGroup === "Owner") {
              history.push("/registerUsers");
            } else {
              history.push("/dashboard");
            }
          });
        },
        (error) => {
          alert(error);
        }
      );
    }
  };

  return (
    <div className="h-screen">
      <div className="floatingCard cardSmall">
        <h1>Change Your Password</h1>
        <form onSubmit={handleResetPassword}>
          <Input
            required
            type="password"
            name="password"
            id="password"
            placeholder="new password"
          />
          <Input
            required
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="confirm password"
          />
          <Button type="submit" value="Submit" className="primaryButton">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
