import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RootState } from "../store/rootReducer";
import { Button, Form, Input } from "reactstrap";
import { signInWithEmail, getUserData } from "../FireConfig";

interface AuthProp {
  required: string;
}

export default function AuthCheck() {
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const history = useHistory();

  const handleLogin = (event: any) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;
    signInWithEmail(email, password).then((user) => {});
  };

  return (
    <div className="h-screen">
      <div className="floatingCard cardSmall">
        <h1>Sign In</h1>
        <Form onSubmit={handleLogin}>
          <Input
            className="styledPrimaryInput"
            required
            type="email"
            name="email"
            id="email"
            placeholder="email"
          />
          <Input
            className="styledPrimaryInput"
            required
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
          {/* todo: link the following to a form */}
          <a
            href="https://github.com/Yet-Another-Data-Aggregator"
            className="requestLink"
          >
            Request an account
          </a>
          <Button type="submit" value="Submit" className="primaryButton">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
}
