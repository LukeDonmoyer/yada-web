/**
 * Contact Us page component
 * Author: Brendan Ortmann
 */
import { useState } from "react";
import { Button, Form, Input, Alert } from "reactstrap";
import { createEmailDocument } from "../FireConfig";
import { Redirect, useHistory } from "react-router-dom";
import "../assets/styles.scss";

export default function ContactUs(){

  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  const history = useHistory();

  function handleEvent(func: any){
    return (event: any) => {
      event.preventDefault();
      func(event.target.value);
    };
  }

  const sendEmail = (event: any) => {
    createEmailDocument(email, message);
    alert("Email sent!"); // Replace with Reactstrap alert
    history.push("/");
  };

  return (
    <div className="px-80 py-8">
      <h1>Contact Us</h1>
      <Form onSubmit={sendEmail}>
        <Input
          className="styledPrimaryInput"
          required
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={handleEvent(setEmail)}
        />
        <Input
          className="styledPrimaryInput"
          required
          type="textarea"
          name="textarea"
          id="textarea"
          rows="4"
          placeholder="Message"
          value={message}
          onChange={handleEvent(setMessage)}
        />
        <Button type="submit" value="Submit" className="primaryButton">
          Contact Us
        </Button>
      </Form>
    </div>
  );
}