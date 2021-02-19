/**
 * Contact Us page component
 * Author: Brendan Ortmann
 */
import { useState } from "react";
import { Button, Form, Input, Alert } from "reactstrap";
import { createEmailDocument } from "../FireConfig";
import { Redirect } from "react-router-dom";
import "../assets/styles.scss";

export default function ContactUs() {
  let [email, setEmail] = useState("");
  let [message, setMessage] = useState("");
  let [submitted, setSubmitted] = useState(false);

  function handleEvent(func: any) {
    return (event: any) => {
      event.preventDefault();
      func(event.target.value);
    };
  }

  const sendEmail = (event: any) => {
    createEmailDocument(email, message, "YADA Contact Us");
    alert("Email sent!"); // Replace with Reactstrap alert?
    setSubmitted(true);
  };

  return submitted ? (
    <Redirect push to="/" />
  ) : (
    <div className="contactUs h-screen">
      <div className="card">
        <h1>Contact Us</h1>
        <Form onSubmit={sendEmail} className="py-8">
          <Input
            required
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEvent(setEmail)}
          />
          <Input
            required
            type="textarea"
            name="textarea"
            id="textarea"
            rows="4"
            placeholder="Message"
            value={message}
            onChange={handleEvent(setMessage)}
          />
          <Button type="submit" value="Submit">
            Contact Us
          </Button>
        </Form>
      </div>
    </div>
  );
}
