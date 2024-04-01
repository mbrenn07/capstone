#!/bin/bash

(ollama serve) & (cd hippocrates || exit; python -m flask --app main run) & (cd DocBotHealth || exit; npx expo run:android --variant release)