import React, { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    String, name,
    String, age,
    String, address,
    String, city,
    String, height,
    String, weight,
    String, allergies,
    String, healthConditions,
    String, profileImage,
    language,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;