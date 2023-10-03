import React from "react";

import "./CombinedPage.css";
import ChatPage from "../Chatpage/ChatPage";
import MsgPage from "../MessagePage/MessagePage";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { ChatIdProvider } from "../../ChatIdContext";



const CombinedPage = () =>{

    const navigate = useNavigate();
    const [username, setUsername] = useState(null);

    // From the broser cookie (jwt-token), get Jwt Token
    const getJwtTokenFromCookie = ()=>{
        const cookieValue = document.cookie
            .split(';')
            .find(row => row.startsWith('jwt-token='))
            .split('=')[1];
        
        return cookieValue
    }

    const jwtToken = getJwtTokenFromCookie()

    // Call the /validate endpoint passing on the jwt Token
    const validate = async ()=>{
        try{
            const response = await axios.post('http://localhost:8080/authenticate/validateJwt',{jwtToken: jwtToken})
            
            // Extract data from the response
        const { setFlag, invalidFlag, receivedJwtToken, username } = response.data;
                // Use the extracted data as needed
                console.log('Validation response:');
                console.log('setFlag:', setFlag);
                console.log('invalidFlag:', invalidFlag);
                console.log('receivedJwtToken:', receivedJwtToken);
                console.log('username:', username);

                if (invalidFlag){
                    navigate("/login")
                    return null
                }

                if (setFlag){
                    updateCookieToken(receivedJwtToken)
                }

                return (username)

                
        } catch(error){
            console.error('Error validating JWT:', error);
            navigate("/login")    
        }
    }

    function updateCookieToken(jwtToken) {
        // Set the cookie with the JWT token
        document.cookie = `jwt-token=${jwtToken}; path=/`;
      }

    // Calling Validate function
    useEffect(() => {
        // Define an async function to use await
        const fetchData = async () => {
            const username = await validate();
            setUsername(username);
            console.log("Username before Calling ChatPage: ", username);
            // Render ChatPage after getting the username
            return <ChatPage username={username} />;
        };

        // Call the async function and render the ChatPage
        fetchData();

    }, []); // Empty dependency array to ensure this runs only once

    function updateCookieToken(jwtToken) {
        // Set the cookie with the JWT token
        document.cookie = `jwt-token=${jwtToken}; path=/`;
    }

    return (
        <div className="CombinedPage">
            <ChatIdProvider>
            {username && <ChatPage username={username} />} {/* Render ChatPage if username is available */}
            <MsgPage/>
            </ChatIdProvider>
        </div>
    );
};

export default CombinedPage;