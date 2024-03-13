#!/bin/bash

(ollama serve) & (cd hippocrates || exit; python -m flask --app main run)