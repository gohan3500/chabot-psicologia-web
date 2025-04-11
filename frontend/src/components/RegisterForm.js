import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "../api";
import { useNavigate } from "react-router-dom"; // 👈 Importamos esto

const RegisterForm = () => {
  const navigate = useNavigate(); // 👈 Hook de navegación

  const onFinish = async (values) => {
    try {
      const res = await axios.post("/auth/register", values);
      message.success(res.data.mensaje);
      navigate("/"); // 👈 Después de registrar, redirige al login
    } catch (err) {
      message.error(err.response?.data?.mensaje || "Error al registrarse");
    }
  };

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <h2>Registro</h2>
      <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="correo" label="Correo" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="contrasena" label="Contraseña" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Registrarse
        </Button>
        <Button type="link" onClick={() => navigate("/")} block>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
