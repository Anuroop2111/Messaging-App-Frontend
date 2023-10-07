import React, { useContext, useEffect, useState } from "react";
import "./ChatPage.css";
import { ChatIdContext } from "../../ChatIdContext";

const ChatPage = ({ chats }) => {
  const { setSelectedChatId, setRegisterFlag } = useContext(ChatIdContext);

  return (
    <div className="chat-page">
      <div className="left-column">
        <h2>Chats</h2>
        {chats.length == 0 ? (
          <p>No chats</p>
        ) : (
          <div>
            {chats.map((chat) => (
              <a
                href={`/home?chatId=${chat.chatId}`}
                className="chat-list-elem"
                key={chat.chatId}
              >
                {chat.friendName}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
