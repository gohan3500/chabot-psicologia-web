import requests

url = "http://127.0.0.1:5000/auth/login"
data = {
    "correo": "carlos@test.com",
    "contrasena": "1234"
}

response = requests.post(url, json=data)

print("Código de estado:", response.status_code)
print("Respuesta JSON:", response.json())
