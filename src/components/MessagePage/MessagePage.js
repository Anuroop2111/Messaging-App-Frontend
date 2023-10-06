import React, { useContext, useEffect, useState } from "react";
import './MessagePage.css';
import { ChatIdContext } from "../../ChatIdContext";
import axios from 'axios';



const MsgPage = () =>{
    const [messages,setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userid,setUserid] = useState("")
    const {selectedChatId} = useContext(ChatIdContext)

    const cookieName = 'jwt-token'; // The Cookie Name

    async function fetchMessageNames() {
      try {
        console.log("Fetch Message Called")
        const response = await fetch(`http://localhost:8080/api/getMessage/${selectedChatId}`);
        let data = await response.json();
        data.sort()
        setMessages(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const handleNewMessageChange = (event) => {
      setNewMessage(event.target.value)
    }

    const handleSendMessage = async () => {
      if (newMessage.trim()!==""){
        const chatMessage = {
          senderId: userid,
          chatId: selectedChatId,
          content: newMessage
        }
        try {
          console.log(chatMessage)
          const response = await axios.post('http://localhost:8080/api/saveMessage',chatMessage)
          console.log('Message sent');
  
          if (response.status==200) {
            // Update the messages after sending the message
            console.log('Message sent successfully', response);
            fetchMessageNames();
            setNewMessage(""); // Clear the input after sending the message
          } else {
            console.error('Failed to send message');
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    }

    useEffect(()=>{

      // Function to extract a cookie by its name
      const getCookie = (name) => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
          if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
          }
        }
        return null;
      };
    
      const jwtToken = getCookie(cookieName);
      
      if (!jwtToken) {
        console.error('JWT token not found in cookie.');
        // return null;
      }
    
      try {
        const tokenParts = jwtToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        const userId = payload.userid;
        setUserid(userId)

      } catch (error) {
        console.error('Error decoding JWT token:', error);
        // return null;
      }

    if (selectedChatId){
      fetchMessageNames(selectedChatId);
    }


    },[cookieName, selectedChatId])



    return(
        <div className="message-page">
            <div className="right-column">
                <h2>Messages</h2>
                <div className="flex justify w-100">
                {messages.length == 0?<p>No messages to show</p>:<div className="w-100 flex flex-col justify">
                    {messages.map(msg=>(
                        <div className={`${msg.senderId == `${userid}` ? "right-align":"left-align"}`} key={msg.timestamp}>
                        <p >{msg.content}</p>
                        </div>
                    ))}
                    </div>} 
                </div>

                <div className="message-input-container">
                      <input type="text" placeholder="Type a message" value={newMessage} onChange={handleNewMessageChange}/>
                      <button onClick={handleSendMessage}>Send</button>
                </div>
        </div>
        </div>
    )
}

export default MsgPage;