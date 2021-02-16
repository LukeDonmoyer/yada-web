/**
 * Request Account page component
 * Author: Brendan Ortmann
 */
import { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import "../assets/styles.scss";

export default function RequestAccount(){

  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");

  function handleEvent(func: any){
    return (event: any) => {
      func(event.target.value);
    };
  }

  /**
   * This function should attempt to send the message and email from the form
   * to all admin and owner emails.
   * @param event 
   */
  const sendEmail = (event: any) => {
    event.preventDefault();
  };

  return(
    <div>
      <h1>Request Account</h1>
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
          Request Account
        </Button>
      </Form>
    </div>
  );
}