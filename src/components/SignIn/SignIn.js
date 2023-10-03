import React, {useState, userState} from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const SignIn = ({onSignIn}) => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate();

    const handleEmailChange = (e) =>{
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) =>{
        setPassword(e.target.value)
    }

    function updateCookieToken(jwtToken) {
        // Set the cookie with the JWT token
        document.cookie = `jwt-token=${jwtToken}; path=/`;
      }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Auth Logic
        const userCredentials = {
            username: email,
            password
        }

        try{
            const response = await axios.post('http://localhost:8080/auth/authenticateUser',userCredentials)
            
            // If Authentication is successfull
            if (response.status==200){
                console.log('Status Okayy')

                // Call to generate JWT
                const loginData = {
                    username: email,
                    uniqueIdentifier: "Unique"
                }
                const responseJwt = await axios.post('http://localhost:8080/authenticate/generateToken',loginData)
                
                const jwtToken = responseJwt.data.receivedJwtToken;
                const setFlag = responseJwt.data.setFlag;
                const invalidFlag = responseJwt.data.invalidFlag;
                const username = responseJwt.data.username;

                // console.log('jwtToken = ',jwtToken)
                // console.log('setFlag = ',setFlag)
                // console.log('invalidFlag = ',invalidFlag)
                // console.log('username = ',username)

                if (setFlag && !invalidFlag){
                    updateCookieToken(jwtToken)
                    navigate('/combined');
                } else {
                    console.error('Invalid JwtToken')
                    navigate("/login")
                }
                

                // onSignIn(); // The provided onSignIn callback
            } else {
                console.error('Authentication failed')
                navigate("/login")
            }
        } catch(error){
            console.error('Authentication Failed due to error')
            navigate('/login')
        }



    }

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" placeholder="Enter uour email" value={email} onChange={handleEmailChange}/>
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Enter your password" value={password} onChange={handlePasswordChange} />
                </div>

                <button type="submit">Sign In</button>
            </form>
        </div>
    )

}

export default SignIn;
