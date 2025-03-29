import React, { useState } from 'react';
import { Input, Button, List, Typography } from 'antd';
import axios from 'axios'; // Asegúrate de instalar axios con `npm install axios`

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      try {
        const response = await axios.post('http://127.0.0.1:5000/api/chat', {
          message: input,
        });

        console.log('Respuesta del backend:', response.data);

        const botMessage = { text: response.data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
        const errorMessage = { text: 'Error al conectar con el servidor.', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>
                {item.sender === 'user' ? 'Tú: ' : 'Bot: '}
              </Typography.Text>
              {item.text}
            </List.Item>
          )}
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Input
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
        />
        <Button type="primary" onClick={handleSend}>
          Enviar
        </Button>
      </div>
    </div>
  );
}

export default Chat;