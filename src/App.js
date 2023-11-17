import React from "react";
// import './App.css'
// import ChatPage from './components/Chatpage/ChatPage'; // Import your ChatPage component
// import MsgPage from './components/MessagePage/MessagePage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import SignIn from "./components/SignIn/SignIn";
import CombinedPage from "./components/CombinedPage/CombinedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  // const navigate = useNavigate();

  const handleSignIn = () => {
    setIsLoggedIn(true);
    console.log("User signed in!");
    console.log("isLoggedIn:", isLoggedIn);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/login" element={<SignIn onSignIn={handleSignIn} />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <CombinedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
