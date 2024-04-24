//BEGIN MOBILE ONLY
import { polyfill } from 'react-native-polyfill-globals/src/fetch';
import 'text-encoding-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
globalThis.ReadableStream = ReadableStream;
polyfill();
//END MOBILE ONLY
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useState, useContext, useEffect } from "react";
import { View } from '@/components/Themed';
import { TextInput, IconButton, MD3Colors, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import UserContext from '@/constants/UserContext';
import * as Linking from 'expo-linking';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';


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


export default function TabOneScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [recievingResponse, setRecievingResponse] = useState(false);
  const userContext = useContext(UserContext);

  const baseURL = "http://10.0.2.2:5000/";

  const baseInstance = axios.create({
    baseURL: baseURL, //use 10.0.2.2 instead of localhost for android virtual machine
    timeout: undefined
  });

  useEffect(() => {
    let userMessage = "The following is information about the patient: ";
    if (userContext.user.age != undefined) {
      userMessage = userMessage + userContext.user.age + " years old.";
    }

    if (userContext.user.allergies != undefined) {
      userMessage = userMessage + " Allergic to: " + userContext.user.allergies + ".";
    }

    if (userContext.user.healthConditions != undefined) {
      userMessage = userMessage + " Prexisting health conditions: " + userContext.user.healthConditions + ".";
    }

    //only set the prompt if some info is present
    if (userMessage !== "The following is information about the patient: ") {
      baseInstance.get('/initialPrompt/' + userMessage);
    }
  }, [userContext]);


  const generateStream = async () => {
    const response = await fetch(
      baseURL + "/chat/" + message,
      {
        method: 'GET',
        reactNative: { textStreaming: true }, //MOBILE ONLY
      }
    )
    if (response.status !== 200) throw new Error(response.status.toString())
    if (!response.body) throw new Error('Response body does not exist')
    return getIterableStream(response.body)
  }

  async function* getIterableStream(body) {
    const reader = body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) {
        break
      }
      const decodedChunk = decoder.decode(value, { stream: true })
      yield decodedChunk
    }
  }

  const sendMessage = async () => {
    if (message != "") {
      messages.push({ role: "user", message: message });
      setMessage("");
      messages.push({ role: "assistant", message: "" });
      setMessages([...messages]);
      setRecievingResponse(true);
      let showMessage = true;
      const stream = await generateStream();
      for await (const chunk of stream) {
        if (chunk.includes("[")) {
          showMessage = false;
        }

        if (showMessage) {
          messages[messages.length - 1].message = messages[messages.length - 1].message + chunk;
          setMessages([...messages]);
        }
      }
      setRecievingResponse(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatHistory}>
        {messages.map((message, index) => (
          <View
            key={index} //NOSONAR
            style={styles.messageListItem}
          >
            <View style={styles.stack}>
              {message.role == "user" ? (
                <FontAwesome
                  name="user-circle"
                  size={25}
                  color={"black"}
                  style={styles.messageIcon}
                />
              )
                :
                (
                  <FontAwesome6
                    name="user-doctor"
                    size={25}
                    color={"black"}
                    style={styles.messageIcon}
                  />
                )}
              <Text style={styles.messageTitle} variant="headlineSmall">
                {message.role == "user" ? "You" : "Doc Bot"}
              </Text>
            </View>
            <Text style={styles.message} variant="bodyLarge">
              {message.message}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.messageBar}>
        <TextInput
          contentStyle={{ backgroundColor: "white", paddingLeft: 15 }}
          disabled={recievingResponse}
          onSubmitEditing={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={styles.textInput}
          label="Enter your symptoms here"
          value={message}
          onChangeText={message => setMessage(message)}
        />
        <IconButton
          style={styles.icon}
          icon="magnify"
          iconColor={MD3Colors.error50}
          size={34}
          onPress={sendMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageIcon: {
    margin: 6,
    marginRight: 16,
    marginLeft: 10,
  },
  stack: {
    display: "flex",
    flexDirection: "row",
  },
  messageBar: {
    height: 60,
    marginBottom: 10,
    width: "95%",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid"
  },
  chatHistory: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: 1,
    marginTop: 8
  },
  message: {
    margin: 3,
    marginLeft: 50,
    marginRight: 6,
  },
  messageTitle: {
    flex: 1,
  },
  messageListItem: {
    margin: 3,
    borderRadius: 4,
    marginTop: 10,
    fontWeight: "bold",
  },
  textInput: {
    width: "93%"
  },
  icon: {
    position: "absolute",
    left: "86%",
  }
});
