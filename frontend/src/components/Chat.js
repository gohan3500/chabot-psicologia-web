import React, { useState, useRef, useEffect } from "react";
import { Input, Button, List, Typography, Layout, Card } from "antd";
import axios from "axios";

const { Content, Footer } = Layout;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage]);
      setInput("");

      try {
        const response = await axios.post("http://127.0.0.1:5000/api/chat", {
          message: input,
        });

        const botMessage = { text: response.data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        const errorMessage = {
          text: "Error al conectar con el servidor.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Layout style={{ height: "100%" }}>
      <Content
        style={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Card style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item
                style={{
                  justifyContent:
                    item.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor:
                      item.sender === "user" ? "#1890ff" : "#f0f0f0",
                    color: item.sender === "user" ? "#fff" : "#000",
                  }}
                >
                  <Typography.Text
                    strong
                    style={{ color: item.sender === "user" ? "#fff" : "#000" }}
                  ></Typography.Text>
                  {item.text}
                </div>
              </List.Item>
            )}
          />
          <div ref={chatEndRef} />
        </Card>
        <div style={{ display: "flex", gap: "10px" }}>
          <Input
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleSend}>
            Enviar
          </Button>
        </div>
      </Content>
      <Footer
        style={{ fontSize: "12px", textAlign: "center", margin: "-15px" }}
      >
        AI Chatbot Application ©2025
      </Footer>
    </Layout>
  );
}

export default Chat;
