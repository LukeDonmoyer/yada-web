import { useState } from "react";
import { Button, Form, Input } from "reactstrap";
import "../assets/styles.scss";

export default function ContactUs(){

  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");

  function handleEvent(func: any){
    return (event: any) => {
      event.preventDefault();
      func(event.target.value);
    };
  }

  const sendEmail = (event: any) => {
    event.preventDefault();
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