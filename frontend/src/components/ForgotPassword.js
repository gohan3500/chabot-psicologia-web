import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axiosInstance from "../context/axiosInstance";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", values);
      message.success(res.data.mensaje);
      navigate("/login"); // Redirige al login después de cambiar la contraseña
    } catch (err) {
      console.error("Error al cambiar la contraseña:", err);
      const errorMessage =
        err.response?.data?.mensaje || "Error al cambiar la contraseña";
      message.error(errorMessage);
    }
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
          Restablecer Contraseña
        </Title>
        <Form
          name="reset-password"
          layout="vertical"
          onFinish={handleResetPassword}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            name="correo"
            label="Correo Electrónico"
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
            name="nueva_contrasena"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: "Por favor ingresa tu nueva contraseña" },
            ]}
          >
            <Input.Password placeholder="Ingresa tu nueva contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Restablecer Contraseña
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;