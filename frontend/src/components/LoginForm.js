import React from "react";

import { Form, Input, Button, message, Typography } from "antd";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("/auth/login", values);
      message.success(res.data.mensaje);
      login();
      navigate("/chat");
    } catch (err) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al iniciar sesión";
      message.error(errorMessage);

      if (errorMessage === "Correo no encontrado") {
        form.setFields([
          {
            name: "correo",
            errors: [errorMessage || ""],
          },
        ]);
      } else if (errorMessage === "Contraseña incorrecta") {
        form.setFields([
          {
            name: "contrasena",
            errors: [errorMessage || ""],
          },
        ]);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    // Client-side validation errors are handled by AntD itself
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24, fontSize: 30 }}
        >
          Iniciar Sesión
        </Title>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="correo"
            label="Correo Electrónico"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: "Por favor ingresa tu correo electrónico",
              },
              { type: "email", message: "Por favor ingresa un correo válido" },
            ]}
          >
            <Input placeholder="Ingresa tu correo electrónico" />
          </Form.Item>
          <Form.Item
            name="contrasena"
            label="Contraseña"
            validateTrigger="onBlur"
            rules={[
              { required: true, message: "Por favor ingresa tu contraseña" },
            ]}
          >
            <Input.Password placeholder="Ingresa tu contraseña" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ marginTop: 10, marginBottom: 16 }}
            >
              Entrar
            </Button>
            <Button type="link" onClick={() => navigate("/register")} block>
              ¿No tienes cuenta? Regístrate
            </Button>
          </Form.Item>
        </Form>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginTop: 16 }}
        >
          © 2025 AI Chatbot
        </Text>
      </div>
    </div>
  );
};

export default LoginForm;
