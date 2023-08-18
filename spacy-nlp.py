import spacy
import Levenshtein
import requests
import sys
import json
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("NUXT_ENV_RAPID_API_KEY")
nlp = spacy.load("en_core_web_trf")
text = sys.argv[1]

# Preprocess the document (tokenization and stopwords removal)
doc = nlp(text)

vocab_words = [token.text for token in doc if token.pos_ in ['NOUN', 'ADJ', 'PROPN'] and not token.is_stop]
vocab_words = [word.lower() for word in vocab_words]
filtered = list(set(vocab_words))
filtered.sort()

similar_words = set()

for word in filtered:
    for second_word in filtered:
        distance = Levenshtein.distance(word, second_word)
        if (distance <= 2 and word != second_word):
            pair = (word if word < second_word else second_word, second_word if word < second_word else word)
            similar_words.add(pair)

# url = "https://lingua-robot.p.rapidapi.com/language/v1/entries/en/church"

# headers = {
# 	"X-RapidAPI-Key": api_key,
# 	"X-RapidAPI-Host": "lingua-robot.p.rapidapi.com"
# }

# response = requests.get(url, headers=headers)
# response_json = response.json()

# print(json.dumps(response_json, indent=4))

# TODO: print similar_words ???
print(json.dumps(filtered, indent=4))