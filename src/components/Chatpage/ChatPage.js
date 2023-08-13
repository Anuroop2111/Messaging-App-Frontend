import React, { useEffect, useState } from 'react';
import './ChatPage.css';

const ChatPage = () => {
  const [chats,setChats] = useState([]);
  async function fetchChatNames() {
    try {
      const response = await fetch('http://localhost:8080/api/getChatNames/anuroop@test.com');
      const data = await response.json();
      console.log(data)
      setChats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(()=>{
  (async ()=>{
    await fetchChatNames();
    })()

  },[])
  return (
    <div className="chat-page">
      <div className="left-column">
        <h2>Chats</h2>
        {chats.length == 0 ?<p>No chats</p>:<div>
          {chats.map((chat)=>(
            <a href={`/chat/${chat.chatId}`} className="chat-list-elem" key={chat.chatId}>{chat.friendName}</a>
          ))}
          </div>}
      </div>
    </div>
  );
};

export default ChatPage;
