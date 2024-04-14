import React, { useContext } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import UserContext from '@/constants/UserContext';
import * as Linking from 'expo-linking';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout(props) {
  const colorScheme = useColorScheme();
  const user = useContext(UserContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: "red" },
        headerTintColor: "white",
        headerRight: () => (
          <View style={styles.stack}>
            <Pressable>
              {({ pressed }) => (
                <AntDesign
                  name="phone"
                  size={25}
                  color={"white"}
                  style={{ opacity: pressed ? 0.5 : 1, marginRight: 5  }}
                  onPress={() => {
                    if (user.user.emergencyPhoneNumber) {
                      Linking.openURL("tel:" + user.user.emergencyPhoneNumber);
                    }
                  }}
                />
              )}
            </Pressable>
            <Link href="/(tabs)/two" asChild style={styles.icon}>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={"white"}
                    style={{ opacity: pressed ? 0.5 : 1}}
                  />
                )}
              </Pressable>
            </Link>
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Doc Bot',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user-doctor" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'User Profile',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Health Data',
          tabBarIcon: ({ color }) => <AntDesign name="database" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  stack: {
    width: 60,
    height: 27,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "red",
  },
});