import React, { useState, useRef, useEffect } from "react";
import { Input, Button, List, Typography, Layout, Card } from "antd";
import axios from "axios";
import jsPDF from "jspdf";

const { Content, Footer } = Layout;

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [role, setRole] = useState("");
  const [isRoleSubmitted, setIsRoleSubmitted] = useState(false);
  const [log, setLog] = useState("");
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages([...messages, userMessage]);
      setLog((prevLog) => prevLog + `User: ${input}\n`);
      setInput("");

      try {
        const response = await axios.post("http://127.0.0.1:5000/api/chat", {
          message: input,
          role: role,
          log: log,
        });

        const botMessage = { text: response.data.response, sender: "bot" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLog((prevLog) => prevLog + `Bot: ${response.data.response}\n`);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        const errorMessage = {
          text: "Error al conectar con el servidor.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setLog(
          (prevLog) => prevLog + `Bot: Error al conectar con el servidor.\n`
        );
      }
    }
  };

  const handleRoleSubmit = () => {
    if (role.trim() && input.trim()) {
      const firstMessage = { text: input, sender: "user" };
      setMessages([firstMessage]);
      setLog(`User: ${input}\n`);
      setIsRoleSubmitted(true);
      setInput("");
    } else {
      alert("Por favor, ingresa un rol y un mensaje inicial.");
    }
  };

  const handleConfig = () => {
    handleRoleSubmit();
    handleSend();
  };

  // Scroll to the bottom of the chat whenever a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // PDF creation
  const handleDownloadLog = () => {
    const pdf = new jsPDF();
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const maxWidth = pageWidth * 0.6;
    const lineHeight = 8;
    let y = margin;

    pdf.setFont("Helvetica");

    y += lineHeight + 0.5;
    pdf.setFontSize(20);
    pdf.text("Chat Log", margin, y);
    y += lineHeight + 4;

    pdf.setFontSize(11);
    const entries = log.split("\n").filter((line) => line.trim() !== "");

    entries.forEach((entry) => {
      const isUser = entry.startsWith("User:");
      const sender = isUser ? "Usuario" : "Entrevistado";
      const message = entry.replace(/^User: |^Bot: /, "");

      const lines = pdf.splitTextToSize(message, maxWidth);
      const boxHeight = lines.length * lineHeight + 4;
      const boxWidth =
        Math.max(...lines.map((line) => pdf.getTextWidth(line))) + 6;

      const senderHeight = 5;
      const totalHeight = senderHeight + boxHeight;

      if (y + totalHeight + margin > pageHeight) {
        pdf.addPage();
        y = margin;
      }

      const x = isUser ? pageWidth - boxWidth - margin : margin;
      const fillColor = isUser ? [200, 230, 255] : [230, 230, 230];

      pdf.setFontSize(9);
      pdf.setTextColor(100);
      pdf.text(sender, x, y);

      pdf.setFillColor(...fillColor);
      pdf.roundedRect(x, y + 2, boxWidth, boxHeight, 3, 3, "F");

      pdf.setTextColor(0);
      pdf.setFontSize(11);
      let textY = y + lineHeight + 2;
      lines.forEach((line) => {
        pdf.text(line, x + 3, textY);
        textY += lineHeight;
      });

      y += totalHeight + 4;
    });

    pdf.save("chat_log.pdf");
  };

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
        {!isRoleSubmitted && (
          <Card
            style={{
              margin: "100px 370px",
              padding: "15px",
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Typography.Title
              level={3}
              style={{
                marginBottom: "15px",
                marginTop: "-5px",
                textAlign: "center",
              }}
            >
              Configuración Inicial
            </Typography.Title>
            <Input
              placeholder="Rol del entrevistado"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onPressEnter={handleConfig}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Escribe tu primer mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleConfig}
              style={{ marginBottom: "10px" }}
            />
            <Button type="primary" onClick={handleConfig} block>
              Iniciar Chat
            </Button>
          </Card>
        )}
        {isRoleSubmitted && (
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
                    {item.text}
                  </div>
                </List.Item>
              )}
            />
            <div ref={chatEndRef} />
          </Card>
        )}
        {isRoleSubmitted && (
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
            <Button onClick={handleDownloadLog}>Descargar Chat</Button>
          </div>
        )}
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
