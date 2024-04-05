import { createContext, useState } from 'react';
const [user, setUser] = useState({});

export default UserContext = createContext({user: user, setUser: setUser});