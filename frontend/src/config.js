
const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://notes-app-mern-bi29.onrender.com';
export default API_BASE;