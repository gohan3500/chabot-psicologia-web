from chatbot.nlu import classify_intent

def chatbot_response(user_message):
    """Gestiona la lógica de respuesta del chatbot."""
    response = classify_intent(user_message)
    return response