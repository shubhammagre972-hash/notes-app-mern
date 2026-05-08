import React, { createContext, useContext, useState } from 'react';

const authContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // read token on load

  const login = (userData, authToken) => {
  console.log("✅ context login() called with token:", authToken);
  setUser(userData);
  setToken(authToken);
  localStorage.setItem('token', authToken);
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <authContext.Provider value={{ user, token, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default ContextProvider;