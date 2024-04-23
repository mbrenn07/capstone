import React from 'react';
import UserContext from '@/constants/UserContext'
import App from '@/app/(tabs)/two';

export default function App() {
  return (
    <UserProvider>
      <ProfileScreen />
    </UserProvider>
  );
}