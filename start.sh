#!/bin/bash

(ollama serve) & (cd hippocrates || exit; python3 -m flask --app main run) & (cd kos || exit; npm run android)