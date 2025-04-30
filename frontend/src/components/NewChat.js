import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Typography,
  Card,
  message as antdMessage,
  Skeleton,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

export default function NewChat() {
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [firstMessage, setFirstMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const user_id = userData?.id;

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await axios.get("/roles/list-roles");
        setRoles(res.data);
      } catch (err) {
        console.error("Error loading roles:", err);
        antdMessage.error("No se pudieron cargar los roles");
      } finally {
        setRolesLoading(false);
      }
    }
    loadRoles();
  }, []);

  const handleStart = async () => {
    if (!roleId || !firstMessage.trim()) {
      antdMessage.warning("Seleccione un rol y escriba el primer mensaje");
      return;
    }

    const selectedRole = roles.find((r) => r.id === roleId);
    if (!selectedRole) {
      antdMessage.error("No se encontró el rol seleccionado");
      return;
    }

    const role_context = `${selectedRole.nombre_rol}, ${selectedRole.descripcion}`;

    setLoading(true);
    try {
      const res = await axios.post("/api/chats", {
        role_id: roleId,
        role_context,
        message: firstMessage.trim(),
        user_id: user_id,
      });

      const { chat_id } = res.data;
      window.dispatchEvent(new Event("refreshChats"));
      navigate(`/chat/${chat_id}`);
    } catch (err) {
      console.error("Error creating chat:", err);
      antdMessage.error("No se pudo iniciar el chat");
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = roles.find((r) => r.id === roleId);

  return (
    <Card
      style={{
        maxWidth: 500,
        margin: "90px auto",
        padding: "0px",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 0 }}>
          Nueva Entrevista
        </Title>
        <Text type="secondary">Simulación con un personaje virtual</Text>
      </div>

      {rolesLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <>
          <Select
            placeholder="Selecciona un rol"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={setRoleId}
            value={roleId}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {roles.map((r) => (
              <Select.Option key={r.id} value={r.id}>
                {r.nombre_rol}
              </Select.Option>
            ))}
          </Select>

          {/* {selectedRole && (
            <div
              style={{
                background: "#f6f8fa",
                padding: "12px 16px",
                borderRadius: 6,
                marginBottom: 16,
                borderLeft: "4px solid #1890ff",
              }}
            >
              <Text strong>{selectedRole.nombre_rol}</Text>
              <Paragraph style={{ margin: "4px 0 0" }}>
                {selectedRole.descripcion || <em>Sin descripción</em>}
              </Paragraph>
            </div>
          )} */}
        </>
      )}

      <Input.TextArea
        rows={3}
        placeholder="Escribe tu primer mensaje..."
        value={firstMessage}
        onChange={(e) => setFirstMessage(e.target.value)}
        style={{ marginBottom: 16 }}
        onPressEnter={handleStart}
      />

      <Button
        type="primary"
        block
        onClick={handleStart}
        loading={loading}
        size="large"
      >
        Iniciar Entrevista
      </Button>
    </Card>
  );
}
