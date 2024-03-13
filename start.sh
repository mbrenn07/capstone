#!/bin/bash

(ollama serve) & (cd hippocrates || exit; python -m flask --app main run) & (cd kos || exit; npm run web)