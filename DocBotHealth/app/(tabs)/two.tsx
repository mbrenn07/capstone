import { StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import UserContext from '@/constants/UserContext';
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';


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
  [key: string]: string;
}

const codeToLanguage = Object.fromEntries(Object.entries(languageCodes).map(([name, code]) => [code, name]));

export default function App() {
  const userContext = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(userContext.user.profileImage);

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
  });

  const handleEditToggle = () => {
    if (isEditing) {
      userContext.setUser({...userContext.user, ...userInfo});
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
            if (response.didCancel) {
              console.log('User cancelled image capture');
            } else if (response.errorCode) {
              console.log('ImagePicker Error: ', response.errorMessage);
            } else {
              const source = { uri: response.assets[0].uri };
              setProfileImage(source.uri);
              userContext.setUser({ ...userContext.user, profileImage: source.uri });
            }
          }),
        },
        {
          text: "Choose from Library",
          onPress: () => launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.log('ImagePicker Error: ', response.errorMessage);
            } else {
              const source = { uri: response.assets[0].uri };
              setProfileImage(source.uri);
              userContext.setUser({ ...userContext.user, profileImage: source.uri });
            }
          }),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
          <TouchableOpacity onPress={updateProfileImage} disabled={!isEditing}>
              <Image
                source={profileImage ? { uri: profileImage } : require('@/assets/images/default-profile-icon.png')}
                style={styles.profilePic}
              />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {Object.keys(userInfo).map(key => (
            <View style={styles.fullWidth} key={key}>
              <Text style={styles.userInfoText}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
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
                ) : (
                  <TextInput
                    style={styles.userInfoEdit}
                    value={userInfo[key]}
                    onChangeText={(text) => setUserInfo({ ...userInfo, [key]: text })}
                  />
                )
              ) : (
                key === 'language' ? (
                  <Text style={styles.userInfoText}>{codeToLanguage[userInfo.language]}</Text>  // Display the language name
                ) : (
                  <Text style={styles.userInfoText}>{userInfo[key]}</Text>
                )
              )}
            </View>
          ))}
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