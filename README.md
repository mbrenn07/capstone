# Capstone

## Installation Instructions

### Backend

1) Run `cd hippocrates; pip install -r requirements.txt`

2) Install ollama from https://ollama.com/download

3) Uncomment out the code at the top of main.py under "Used to initially download the model locally" on your first run

Note: If you get an error about ollama not being found, try restarting your VScode by closing every open window and try again.

### Frontend (Other)

4) Run `cd DocBotHealth; npm install`

5) Run `npm run android` and follow the provided steps to set up the android emulator or use your own device

### Frontend (iOS)

6) Run `cd DocBotHealth/`

7) Run `npx expo start -c` until rebuilding is done. Once it displays the option, CTRL+C

8) Run `npm run ios` and this should install CocoaPods and install all dependencies

Note: If encountering an error like "Unable to resolve "x" from "y", cd into "DocBotHealth/" and run 'npm install',
      then cd in into "ios/" and run "pod install", then repeat steps 6-8.
### Both

9) `bash start.sh`
