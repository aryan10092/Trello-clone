
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
};


export const getApiUrl = (endpoint = '') => {
  return `${config.API_URL}${endpoint}`;
};


export const getSocketUrl = () => {
  return config.SOCKET_URL;
};

export default config;
