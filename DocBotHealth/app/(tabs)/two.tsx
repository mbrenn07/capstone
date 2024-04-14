import { StyleSheet } from 'react-native';
import React, { useContext, useEffect } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import UserContext from '@/constants/UserContext';
import { TextInput } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";


export default function TabTwoScreen() {
  const user = useContext(UserContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
      <PhoneInput
            defaultCode="US"
            layout="first"
            onChangeFormattedText={(text) => {
              var re = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm
              if (re.test(text)) {
                user.setUser({...user.user, emergencyPhoneNumber: text});
              }
            }}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
