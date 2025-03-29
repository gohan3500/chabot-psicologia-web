import json
import random
import spacy
import os

# Ruta absoluta al archivo intents.json
intents_path = os.path.join(os.path.dirname(__file__), "../data/intents.json")

# Cargar modelo de spaCy
nlp = spacy.load("es_core_news_md")

# Cargar intenciones desde el archivo JSON
with open(intents_path, "r", encoding="utf-8") as file:
    intents = json.load(file)

def classify_intent(user_input):
    """Analiza el texto y devuelve la intención detectada."""
    doc_input = nlp(user_input.lower())  # Procesar texto con Spacy
    best_match = None
    best_score = 0.0

    for intent in intents["intents"]:
        for pattern in intent["patterns"]:
            doc_pattern = nlp(pattern.lower())
            similarity = doc_input.similarity(doc_pattern)  # Calcula similitud

            if similarity > best_score:  # Busca la mejor coincidencia
                best_score = similarity
                best_match = intent

    if best_match and best_score > 0.7:  # Ajustar umbral de similitud
        return random.choice(best_match["responses"])
    
    return "No estoy seguro de entender. ¿Puedes reformularlo?"

# Prueba simple
if __name__ == "__main__":
    while True:
        user_input = input("Tú: ")
        if user_input.lower() in ["salir", "exit"]:
            break
        response = classify_intent(user_input)
        print("Chatbot:", response)
