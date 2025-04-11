import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("/auth/login", values);
      message.success(res.data.mensaje);
      login(); // Marca al usuario como autenticado
      navigate("/chat");
    } catch (err) {
      message.error(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <h2>Iniciar Sesión</h2>
      <Form.Item name="correo" label="Correo" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        name="contrasena"
        label="Contraseña"
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Entrar
        </Button>
        <Button type="link" onClick={() => navigate("/register")} block>
          ¿No tienes cuenta? Regístrate
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
