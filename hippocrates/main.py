from flask import Flask, Response, stream_with_context
from flask_cors import CORS
import ollama
import json
from sentence_transformers import SentenceTransformer, util

# Used to initially download the model locally
# model = SentenceTransformer('multi-qa-mpnet-base-dot-v1')
# model.save(modelPath)

modelPath = "./model"
model = SentenceTransformer(modelPath)

# Initial setup for vector DB
sentencesFile = open("vectorDatabaseSentences.json")
sentences = json.load(sentencesFile)
embeddings = model.encode(sentences)
sentencesFile.close()

previousMessages = []

# Begin API

app = Flask(__name__)
cors = CORS(app)

@app.route("/initialPrompt/<initialPrompt>")
def initialPrompt(initialPrompt):
    previousMessages.append({
            'role': 'system',
            'content': initialPrompt,
    })

@app.route("/chat/<message>")
def main(message):

    # Gets top 5 pieces of relevant context from vector database
    dot_sim = util.dot_score(embeddings, model.encode(message))
    all_combinations = []
    for i in range(len(dot_sim) - 1):
        all_combinations.append([dot_sim[i][0], i])
    dot_sim = sorted(dot_sim, key=lambda x: x[0], reverse=True)

    context = " Here is some additional context about the problem: "
    for score, i in all_combinations[0:5]:
        context = context + sentences[i] + ", "

    context = context[:-2]

    # Updates previous message log
    previousMessages.append({
            'role': 'system',
            'content': context,
    })
    previousMessages.append({
            'role': 'user',
            'content': message,
    })

    stream = ollama.chat(model='medllama2:7b-q2_K', messages=previousMessages, stream=True)

    def generate():
        for chunk in stream:
            yield chunk['message']['content']

    return Response(stream_with_context(generate()))

@app.route("/clear")
def clear():
    previousMessages.clear()
    return None
