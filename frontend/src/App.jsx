import { useState } from "react";
import "./App.css";

function App() {
  const [registering, setRegistering] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const clickButton = (e) => {
    e.preventDefault();

    alert(username);
    alert(password);
  };

  return (
    <div className="container">
      {loggedIn === true ? (
        <div></div>
      ) : (
        <form onSubmit={clickButton}>
          {registering ? (
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : null}

          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">{!registering ? "Login" : "Register"}</button>

          <div
            className="no_account"
            onClick={() => setRegistering(!registering)}
          >
            {registering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </div>
        </form>
      )}
    </div>
  );
}

export default App;
