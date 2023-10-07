import React from "react";

import "./CombinedPage.css";
import ChatPage from "../Chatpage/ChatPage";
import MsgPage from "../MessagePage/MessagePage";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChatIdProvider } from "../../ChatIdContext";

const CombinedPage = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const chatId = urlParams.get("chatId");
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // From the broser cookie (jwt-token), get Jwt Token
  const getJwtTokenFromCookie = () => {
    const cookieValue = document.cookie
      .split(";")
      .find((row) => row.startsWith("jwt-token="))
      .split("=")[1];

    return cookieValue;
  };

  async function fetchChatNames() {
    try {
      if (!localStorage.getItem("username")) {
        return false;
      }
      const username = localStorage.getItem("username");
      const response = await fetch(
        `http://localhost:8080/api/getChatNames/${username}`
      );
      const data = await response.json();
      console.log("data = ", data);
      setChats(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const jwtToken = getJwtTokenFromCookie();

  // Call the /validate endpoint passing on the jwt Token
  const validate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/authenticate/validateJwt",
        { jwtToken: jwtToken }
      );

      // Extract data from the response
      const { setFlag, invalidFlag, receivedJwtToken, username } =
        response.data;
      // Use the extracted data as needed
      console.log("Validation response:");
      console.log("setFlag:", setFlag);
      console.log("invalidFlag:", invalidFlag);
      console.log("receivedJwtToken:", receivedJwtToken);
      console.log("username:", username);

      if (invalidFlag) {
        navigate("/login");
        return null;
      }

      if (setFlag) {
        updateCookieToken(receivedJwtToken);
      }

      return username;
    } catch (error) {
      console.error("Error validating JWT:", error);
      navigate("/login");
    }
  };

  function updateCookieToken(jwtToken) {
    // Set the cookie with the JWT token
    document.cookie = `jwt-token=${jwtToken}; path=/`;
  }

  // Calling Validate function
  useEffect(() => {
    setLoading(true);
    fetchChatNames();
    setLoading(false);
  }, []); // Empty dependency array to ensure this runs only once

  function updateCookieToken(jwtToken) {
    // Set the cookie with the JWT token
    document.cookie = `jwt-token=${jwtToken}; path=/`;
  }
  if (loading) {
    return <div>Loading</div>;
  }
  console.log({ chats });

  return (
    <div className="CombinedPage">
      <ChatIdProvider>
        {<ChatPage chats={chats} />}{" "}
        {/* Render ChatPage if username is available */}
        <MsgPage currentChatId={chatId} chats={chats} />
      </ChatIdProvider>
    </div>
  );
};

export default CombinedPage;
