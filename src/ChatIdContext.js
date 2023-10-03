import React, { createContext, useState } from 'react';

const ChatIdContext = createContext();

const ChatIdProvider = ({ children }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <ChatIdContext.Provider value={{ selectedChatId, setSelectedChatId }}>
      {children}
    </ChatIdContext.Provider>
  );
};

export { ChatIdProvider, ChatIdContext };
