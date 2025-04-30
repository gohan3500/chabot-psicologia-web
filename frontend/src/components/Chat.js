import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  List,
  Layout,
  Card,
  message as antdMessage,
  Spin,
} from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { exportChatLog } from "../utils/pdf";

const { Content, Footer } = Layout;

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roleContext, setRoleContext] = useState("");
  const [log, setLog] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) navigate("/login");

  const user_id = userData?.id;

  useEffect(() => {
    async function loadChat() {
      try {
        const res = await axios.get(`/api/chats/${chatId}`, {
          params: { user_id },
        });
        const { role_context, messages: history } = res.data;
        setRoleContext(role_context);
        setMessages(
          history.map((m) => ({ text: m.content, sender: m.sender }))
        );
        setLog(
          history
            .map((m) => `${m.sender === "user" ? "User" : "Bot"}: ${m.content}`)
            .join("\n") + "\n"
        );
      } catch (err) {
        console.error("Error loading chat:", err);
        navigate("/chat");
      }
    }
    loadChat();
  }, [chatId, navigate, user_id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setSending(true);
    const userTxt = input.trim();
    setMessages((prev) => [...prev, { text: userTxt, sender: "user" }]);
    setLog((prev) => prev + `User: ${userTxt}\n`);
    setInput("");

    try {
      setTyping(true);

      const res = await axios.post(`/api/chats/${chatId}/messages`, {
        user_id: user_id,
        message: userTxt,
        role_context: roleContext,
      });

      const botTxt = res.data.response;

      const delay = 500 + Math.random() * 800; // 500ms to 1300ms
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: botTxt, sender: "bot" }]);
        setLog((prev) => prev + `Bot: ${botTxt}\n`);
        setTyping(false);
      }, delay);
    } catch (err) {
      console.error("Error sending message:", err);
      antdMessage.error("Fallo la comunicación con el servidor");
      setMessages((prev) => [
        ...prev,
        { text: "Error del servidor.", sender: "bot" },
      ]);
      setLog((prev) => prev + `Bot: Error del servidor.\n`);
      setTyping(false);
    } finally {
      window.dispatchEvent(new Event("refreshChats"));
      setSending(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

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
        <Card
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "15px",
            background: "#fefefe",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
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
                    padding: "10px 14px",
                    borderRadius: "12px",
                    backgroundColor:
                      item.sender === "user" ? "#1677ff" : "#e6f4ff",
                    color: item.sender === "user" ? "#fff" : "#000",
                    fontSize: "14px",
                    animation: "fadeIn 0.3s ease-in-out",
                  }}
                >
                  {item.text}
                </div>
              </List.Item>
            )}
          />
          {typing && (
            <div style={{ paddingLeft: "10px" }}>
              <Spin size="small" tip="Escribiendo..." />
            </div>
          )}
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
          <Button type="primary" onClick={handleSend} loading={sending}>
            Enviar
          </Button>
          <Button onClick={() => exportChatLog(log)}>Descargar Chat</Button>
        </div>
      </Content>
      <Footer style={{ fontSize: "12px", textAlign: "center" }}>
        AI Chatbot Application ©2025
      </Footer>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Layout>
  );
}
