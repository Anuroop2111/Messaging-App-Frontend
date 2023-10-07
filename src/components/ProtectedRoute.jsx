import React from "react";
import { Navigate } from "react-router-dom";
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function checkIfCookiePresent() {
  return !!getCookie("jwt-token");
}

function ProtectedRoute({ children }) {
  return checkIfCookiePresent() ? (
    React.Children.map(children, (child) =>
      React.cloneElement(child, {
        className: `${child.props.className} img-special-class`,
      })
    )
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
