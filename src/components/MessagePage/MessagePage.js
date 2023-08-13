import React, { useEffect, useState } from "react";
import './MessagePage.css';


const MsgPage = () =>{
    const [messages,setMessages] = useState([]);
    async function fetchMessageNames() {
      try {
        const response = await fetch(`http://localhost:8080/api/getMessage/w1x2y3z4`);
        let data = await response.json();
        data.sort()
        setMessages(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    useEffect(()=>{
    (async ()=>{
      await fetchMessageNames();
      })()
  
    },[])
    return(
        <div className="message-page">
            <div className="right-column">
                <h2>Messages</h2>
                <div className="flex justify w-100">
                {messages.length == 0?<p>No messages to show</p>:<div className="w-100 flex flex-col justify">
                    {messages.map(msg=>(
                        <div className={`${msg.senderId == "a1b2c3d4" ? "left-align":"right-align"}`} key={msg.timestamp}>
                        <p >{msg.content}</p>
                        </div>
                    ))}
                    </div>} 
                </div>
        </div>
        </div>
    )
}

export default MsgPage;