import React, { createContext, useState } from "react";

const ChatIdContext = createContext();

const ChatIdProvider = ({ children }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [currentUser, setCurrentUser] = useState([]);
  const [registerFlag, setRegisterFlag] = useState(true);

  return (
    <ChatIdContext.Provider
      value={{
        selectedChatId,
        setSelectedChatId,
        currentUser,
        setCurrentUser,
        registerFlag,
        setRegisterFlag,
      }}
    >
      {children}
    </ChatIdContext.Provider>
  );
};

export { ChatIdProvider, ChatIdContext };
