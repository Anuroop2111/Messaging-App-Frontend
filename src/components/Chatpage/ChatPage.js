import React, { useContext, useEffect, useState } from 'react';
import './ChatPage.css';
import { ChatIdContext } from '../../ChatIdContext';

const ChatPage = ({username}) => {
  const [chats,setChats] = useState([]);
  const {setSelectedChatId} = useContext(ChatIdContext)

  async function fetchChatNames() {
    try {
      const response = await fetch(`http://localhost:8080/api/getChatNames/${username}`);
      const data = await response.json();
      console.log(data)
      setChats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleChatClick = (chatId) => {
    console.log("HandleChatClick called, chatid = ",chatId)
    setSelectedChatId(chatId)
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
            <a href={`/chat/${chat.chatId}`} className="chat-list-elem" key={chat.chatId} onClick={(e) => {e.preventDefault(); handleChatClick(chat.chatId)}}>{chat.friendName}</a>
          ))}
          </div>}
      </div>
    </div>
  );
};

export default ChatPage;
