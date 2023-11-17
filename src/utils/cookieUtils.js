export const getCookie = (name) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
};
export const deleteCookie = (cookieName) => {
  var cookies = document?.cookie?.split("; ");
  console.log("Here");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]?.split("=");
    if (cookie[0] === cookieName) {
      // Set the expiration date of the cookie to a past date
      document.cookie =
        cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("Deleted cookie");
      break;
    }
  }
};
