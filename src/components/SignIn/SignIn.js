import React, { useState, userState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  function updateCookieToken(jwtToken) {
    // Set the cookie with the JWT token
    document.cookie = `jwt-token=${jwtToken}; path=/`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Auth Logic
    const userCredentials = {
      username: email,
      password,
    };

    try {
      const {
        data: { username, receivedJwtToken, setFlag, invalidFlag },
      } = await axios.post(
        "http://localhost:8080/auth/authenticateUser",
        userCredentials
      );
      localStorage.setItem("username", username);
      console.log({ invalidFlag, setFlag, receivedJwtToken, username });
      if (setFlag && !invalidFlag) {
        updateCookieToken(receivedJwtToken);
        navigate("/home");
      } else {
        console.error("Invalid JwtToken");
        navigate("/login");
      }

      // onSignIn(); // The provided onSignIn callback
    } catch (error) {
      console.error("Authentication Failed due to error");
      navigate("/login");
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter uour email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
