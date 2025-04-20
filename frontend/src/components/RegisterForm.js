import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "../api";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("/auth/register", values);
      message.success(res.data.mensaje);
      navigate("/"); // Redirect to login after successful registration
    } catch (err) {
      const errorMessage =
        err.response?.data?.mensaje || "Error al registrarse";
      message.error(errorMessage);

      // Handle dynamic field errors if provided by the backend
      if (err.response?.data?.fields) {
        const fields = Object.entries(err.response.data.fields).map(
          ([name, message]) => ({
            name,
            errors: [message],
          })
        );
        form.setFields(fields);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
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
          Regístrate
        </Title>
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            validateTrigger="onBlur"
            rules={[{ required: true, message: "Por favor ingresa tu nombre" }]}
          >
            <Input placeholder="Ingresa tu nombre" />
          </Form.Item>
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
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
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
              Registrarse
            </Button>
            <Button type="link" onClick={() => navigate("/")} block>
              ¿Ya tienes cuenta? Inicia sesión
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

export default RegisterForm;
