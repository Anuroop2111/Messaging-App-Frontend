import React, { useContext, useEffect, useState } from "react";
import "./ChatPage.css";

const ChatPage = ({ chats }) => {
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
