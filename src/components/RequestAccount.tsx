/**
 * Request Account page component
 * Author: Brendan Ortmann
 */
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, Input } from "reactstrap";
import { createEmailDocument } from "FireConfig";
import "../assets/styles.scss";

export default function RequestAccount(){

  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  let [submitted, setSubmitted] = useState(false);

  function handleEvent(func: any){
    return (event: any) => {
      event.preventDefault();
      func(event.target.value);
    };
  }

  /**
   * This function should attempt to send the message and email from the form
   * to all admin and owner emails.
   * @param event 
   */
  const sendEmail = (event: any) => {
    createEmailDocument(email, message, "YADA Request Account");
    alert("Email sent!"); // Replace with Reactstrap alert
    setSubmitted(true);
  };

  return(
    submitted ? <Redirect push to="/"/> :
    <div className="px-80 py-8 custom">
      <h1>Request Account</h1>
      <Form onSubmit={sendEmail} className="py-8">
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
          Request Account
        </Button>
      </Form>
    </div>
  );
}