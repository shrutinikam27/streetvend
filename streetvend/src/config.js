const rawURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5007';
const API_URL = rawURL.replace(/\/$/, '');

export default API_URL;
