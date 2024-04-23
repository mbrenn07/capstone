import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import UserContext from '@/constants/UserContext';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import PhoneInput from "react-native-phone-number-input";
import AsyncStorage from '@react-native-async-storage/async-storage';


const languageCodes = {
  'Amharic': 'am',
  'Arabic': 'ar',
  'Basque': 'eu',
  'Bengali': 'bn',
  'English (UK)': 'en-GB',
  'Portuguese (Brazil)': 'pt-BR',
  'Bulgarian': 'bg',
  'Catalan': 'ca',
  'Cherokee': 'chr',
  'Croatian': 'hr',
  'Czech': 'cs',
  'Danish': 'da',
  'Dutch': 'nl',
  'English (US)': 'en',
  'Estonian': 'et',
  'Filipino': 'fil',
  'Finnish': 'fi',
  'French': 'fr',
  'German': 'de',
  'Greek': 'el',
  'Gujarati': 'gu',
  'Hebrew': 'iw',
  'Hindi': 'hi',
  'Hungarian': 'hu',
  'Icelandic': 'is',
  'Indonesian': 'id',
  'Italian': 'it',
  'Japanese': 'ja',
  'Kannada': 'kn',
  'Korean': 'ko',
  'Latvian': 'lv',
  'Lithuanian': 'lt',
  'Malay': 'ms',
  'Malayalam': 'ml',
  'Marathi': 'mr',
  'Norwegian': 'no',
  'Polish': 'pl',
  'Portuguese (Portugal)': 'pt-PT',
  'Romanian': 'ro',
  'Russian': 'ru',
  'Serbian': 'sr',
  'Chinese (PRC)': 'zh-CN',
  'Slovak': 'sk',
  'Slovenian': 'sl',
  'Spanish': 'es',
  'Swahili': 'sw',
  'Swedish': 'sv',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Thai': 'th',
  'Chinese (Taiwan)': 'zh-TW',
  'Turkish': 'tr',
  'Urdu': 'ur',
  'Ukrainian': 'uk',
  'Vietnamese': 'vi',
  'Welsh': 'cy',
};

interface UserInfo {
  name: string;
  age: string;
  address: string;
  city: string;
  height: string;
  weight: string;
  allergies: string;
  healthConditions: string;
  language: string;
  emergencyPhoneNumber: string;
  profileImage: string;
}

const codeToLanguage = Object.fromEntries(Object.entries(languageCodes).map(([name, code]) => [code, name]));

const storeUserData = async (userInfo) => {
  try {
    const jsonValue = JSON.stringify(userInfo);
    await AsyncStorage.setItem('userData', jsonValue);
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
}

const loadUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.error('Failed to load user data:', e);
    return null;
  }
}


export default function App() {
  const userContext = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: userContext.user.name,
    age: userContext.user.age,
    address: userContext.user.address,
    city: userContext.user.city,
    height: userContext.user.height,
    weight: userContext.user.weight,
    allergies: userContext.user.allergies,
    healthConditions: userContext.user.healthConditions,
    language: userContext.user.language || 'en',
    emergencyPhoneNumber: userContext.user.emergencyPhoneNumber,
    profileImage: userContext.user.profileImage || ''
  });

  const imageSource = userInfo.profileImage
  ? { uri: userInfo.profileImage }
  : require('@/assets/images/default-profile-icon.png');

  useEffect(() => {
    loadUserData().then(data => {
      if (data) {
        setUserInfo(data);
        userContext.setUser(data);
      }
    });
  }, []);

  useEffect(() => {
    if (userInfo) {
      storeUserData(userInfo);
    }
  }, [userInfo]);
  
  const handleEditToggle = () => {
    if (isEditing) {
      userContext.setUser({ ...userContext.user, ...userInfo });
    }
    setIsEditing(!isEditing);
  };

  const updateProfileImage = () => {
    if (!isEditing) return;
  
    const options: CameraOptions & ImageLibraryOptions = {
      mediaType: 'photo',
    };
  
    Alert.alert(
      "Update Profile Picture",
      "Choose an option",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Take Photo",
          onPress: () => launchCamera(options, (response) => {
            handleImageResponse(response);
          }),
        },
        {
          text: "Choose from Library",
          onPress: () => launchImageLibrary(options, (response) => {
            handleImageResponse(response);
          }),
        },
      ],
      { cancelable: false }
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image selection.');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      const source = { uri: response.assets[0].uri };
      setUserInfo({...userInfo, profileImage: source.uri});
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={updateProfileImage} disabled={!isEditing}>
          <Image
            source={imageSource}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {Object.keys(userInfo).map(key => {
            if (key === 'profileImage') return null;
            return (
              <View style={styles.fullWidth} key={key}>
                <Text style={styles.userInfoText}>{formatTitle(key)}:</Text>
                {isEditing ? (
                  key === 'language' ? (
                    <Picker
                      selectedValue={userInfo.language}
                      style={styles.picker}
                      onValueChange={(itemValue) => setUserInfo({ ...userInfo, language: itemValue })}
                    >
                      {Object.entries(languageCodes).map(([language, code]) => (
                        <Picker.Item key={code} label={language} value={code} />
                      ))}
                    </Picker>
                  ) : key === 'emergencyPhoneNumber' ? (
                    <PhoneInput
                      value={userInfo.emergencyPhoneNumber}
                      defaultCode="US"
                      layout="first"
                      onChangeFormattedText={(text) => {
                        setUserInfo({...userInfo, emergencyPhoneNumber: text});
                      }}
                    />
                  ) : (
                    <TextInput
                      style={styles.userInfoEdit}
                      value={userInfo[key]}
                      onChangeText={(text) => setUserInfo({ ...userInfo, [key]: text })}
                    />
                  )
                ) : (
                  key === 'language' ? (
                    <Text style={styles.userInfoText}>{codeToLanguage[userInfo.language]}</Text>
                  ) : (
                    <Text style={styles.userInfoText}>{userInfo[key]}</Text>
                  )
                )}
              </View>
            );
          })}
        </View>
        <TouchableOpacity onPress={handleEditToggle} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>{isEditing ? 'Confirm' : 'Edit Information'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
  userInfo: {
    width: '100%',
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonStyle: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfoEdit: {
    flex: 1,
    height: 20,
    backgroundColor: 'white',
  },
  profilePic: {
    marginTop: 10,
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 40,
  },
});

function formatTitle(key) {
  return key
    .replace(/([A-Z])/g, ' $1') 
    .replace(/^./, (str) => str.toUpperCase()); 
}