const API_BASE_URL = 
  window.location.hostname === "localhost" 
    ? "http://localhost:3000/rest" 
    : "/rest";

export { API_BASE_URL };
