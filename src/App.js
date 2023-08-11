import React from 'react';
import './App.css'
import ChatPage from './components/Chatpage/ChatPage'; // Import your ChatPage component
import MsgPage from './components/MessagePage/MessagePage';

function App() {
  return (
    <div className="App">
      <ChatPage />
      <MsgPage/>
    </div>

  );
}

export default App;
