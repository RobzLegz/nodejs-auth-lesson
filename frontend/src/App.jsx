import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const REGISTER_ROUTE = "http://localhost:5000/api/user/register";
const LOGIN_ROUTE = "http://localhost:5000/api/user/login";
const USER_INFO_ROUTE = "http://localhost:5000/api/user/info";

function App() {
  const [registering, setRegistering] = useState(false);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios
      .get(USER_INFO_ROUTE, { withCredentials: true })
      .then((res) => {
        const { user } = res.data;
        setUser(user);
      })
      .catch((err) => {
        alert(err?.response?.data?.err);
      });
  }, []);

  const clickButton = async (e) => {
    e.preventDefault();

    if (registering) {
      await axios
        .post(
          REGISTER_ROUTE,
          { email, username, password },
          { withCredentials: true }
        )
        .then((res) => {
          const { user } = res.data;
          setUser(user);
        })
        .catch((err) => {
          alert(err?.response?.data?.err);
        });
    } else {
      await axios
        .post(LOGIN_ROUTE, { username, password }, { withCredentials: true })
        .then((res) => {
          const { user } = res.data;
          setUser(user);
        })
        .catch((err) => {
          alert(err?.response?.data?.err);
        });
    }
  };

  return (
    <div className="container">
      {user ? (
        <div>
          <h1>Welcome {user.username}!</h1>
          <p>{user.email}</p>
        </div>
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
