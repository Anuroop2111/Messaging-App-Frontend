import React, { useContext, useEffect, useState } from "react";
import "./MessagePage.css";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { ToastContainer, toast } from "react-toastify";
import { deleteCookie, getCookie } from "../../utils/cookieUtils";
import "react-toastify/dist/ReactToastify.css";
import { redirect, useNavigate } from "react-router-dom";

var stompClient = null;
var regFlag = true;

const MsgPage = ({ chats, currentChatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userid, setUserid] = useState("");
  // const [flag,setFlag] = useState(true)
  const chatList = chats.map(({ chatId }) => chatId);
  // Register user
  const connect = () => {
    let Sock = new SockJS(`http://localhost:8080/ws`);
    stompClient = over(Sock);
    stompClient.connect({ myHeader: "header" }, onConnected, onError);
  };

  const onConnected = () => {
    console.log("User Subscribed");
    console.log("chatList = ", chatList);
    // Subscribe to cuurent User

    // stompClient.subscribe(subscribeDestination, onPrivateMessage);

    for (var item of chatList) {
      console.log("Item : ", item);
      const subscribeDestination = `/user/${userid}/private/${item}`;
      console.log("subscribeDestination = ", subscribeDestination);
      stompClient.subscribe(subscribeDestination, onPrivateMessage);
    }
  };

  const onPrivateMessage = (payload) => {
    // const payloadData = JSON.parse(payload.body);
    console.log("Received a private message for chatid:", payload.body);
    console.log("currentChatId = ", currentChatId);

    if (currentChatId === payload.body.toString()) {
      console.log("fetching message");
      fetchMessageNames();
    } else {
      console.log("Got a reminder from chat = ", payload.body);
      toast(
        `Recieved a message from ${
          chats.find(({ chatId }) => chatId === payload.body).friendName
        }`
      );
    }
  };

  const onError = (error) => {
    console.error("WebSocket connection error:", error);
  };

  const cookieName = "jwt-token"; // The Cookie Name
  const navigate = useNavigate();
  async function fetchMessageNames() {
    try {
      console.log("Fetch Message Called");
      const response = await axios.get(
        `http://localhost:8080/api/getMessage/${currentChatId}`,
        { withCredentials: true }
      );
      let data = response.data;
      data.sort();
      setMessages(data);
    } catch (error) {
      deleteCookie("jwt-token");
      toast.error(error.response.data);
      console.error("Error fetching data:", error);
      navigate("/home");
    }
  }

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      const chatMessage = {
        senderId: userid,
        chatId: currentChatId,
        content: newMessage,
      };
      try {
        console.log("chatMessage = ", chatMessage);
        const response = await axios.post(
          "http://localhost:8080/api/saveMessage",
          chatMessage
        );
        console.log("Message sent");

        if (response.status == 200) {
          // Update the messages after sending the message
          console.log("Message sent successfully", response);
          fetchMessageNames();
          setNewMessage(""); // Clear the input after sending the message
        } else {
          console.error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

      const messageDestination = "/app/private-message";

      // Send the message over WebSocket
      stompClient.send(messageDestination, {}, JSON.stringify(chatMessage));
    }
  };

  useEffect(() => {
    // Function to extract a cookie by its name

    const jwtToken = getCookie(cookieName);

    if (!jwtToken) {
      console.error("JWT token not found in cookie.");
      // return null;
    }

    try {
      const tokenParts = jwtToken.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.userid;
      setUserid(userId);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      // return null;
    }

    if (currentChatId) {
      fetchMessageNames();
    }
  }, []);

  useEffect(() => {
    if (regFlag) {
      connect();
      if (chatList.length > 0 && userid) {
        regFlag = false;
      }
    }
  }, [chatList, userid]);

  return (
    <div className="message-page">
      <div className="right-column">
        <h2>Messages - {currentChatId}</h2>
        <div className="flex justify w-100">
          {messages.length == 0 ? (
            <p>No messages to show</p>
          ) : (
            <div className="w-100 flex flex-col justify">
              {messages.map((msg) => (
                <div
                  className={`${
                    msg.senderId == `${userid}` ? "right-align" : "left-align"
                  }`}
                  key={msg.timestamp}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default MsgPage;
