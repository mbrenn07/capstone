import { polyfill } from 'react-native-polyfill-globals/src/fetch';
import 'text-encoding-polyfill';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
globalThis.ReadableStream = ReadableStream;
polyfill();
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useState } from "react";
import { View } from '@/components/Themed';
import { TextInput, IconButton, MD3Colors, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import Translate from './Translate';


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

  const baseURL = "http://10.0.2.2:5000/";

  const baseInstance = axios.create({
    baseURL: baseURL, //use 10.0.2.2 instead of localhost for android virtual machine
    timeout: undefined
  });

  const generateStream = async () => {
    const response = await fetch(
      baseURL + "/chat/" + message,
      {
        method: 'GET',
        reactNative: { textStreaming: true },
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
      const stream = await generateStream();
      for await (const chunk of stream) {
        messages[messages.length - 1].message = messages[messages.length - 1].message + chunk;
        setMessages([...messages]);
      }
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatHistory}>
        {messages.map((message, index) => (
          <ScrollView
            nestedScrollEnabled={true}
            key={index} //NOSONAR
            style={message.role == "user" ? styles.messageListItemUser : styles.messageListItemAssistant}
          >
            <Text style={styles.message}>
              {message.message}
            </Text>
          </ScrollView>
        ))}
      </ScrollView>
      <View style={styles.stack}>
      <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
        >
          {Object.keys(languageCodes).map((language) => (
            <Picker.Item key={language} label={language} value={language} />
          ))}
        </Picker>
        <TextInput
          onSubmitEditing={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={styles.textInput}
          label="Message"
          value={message}
          onChangeText={message => setMessage(message)}
        />
        <IconButton
          style={styles.icon}
          icon="send"
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
  stack: {
    display: "flex",
    flexDirection: "row",
    width: "95%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
    marginLeft: 6,
    marginRight: 6,
  },
  messageListItemUser: {
    margin: 3,
    maxWidth: "40%",
    maxHeight: 400,
    borderRadius: 4,
    backgroundColor: "red",
    alignSelf: "flex-end",
    flexGrow: 0,
  },
  messageListItemAssistant: {
    margin: 3,
    maxWidth: "40%",
    maxHeight: 400,
    borderRadius: 4,
    backgroundColor: "blue",
    flexGrow: 0,
    alignSelf: "flex-start",
  },
  textInput: {
    flex: 1,
  },
  icon: {
    width: "50px"
  }
});
