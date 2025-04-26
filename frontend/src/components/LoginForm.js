import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axiosInstance from "../context/axiosInstance"; // Asegúrate de usar la instancia correcta de Axios
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;

const LoginForm = () => {
  const { login } = useAuth(); // Obtén el método login del contexto
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      const res = await axiosInstance.post("/auth/login", values);
      console.log("Respuesta del backend al iniciar sesión:", res.data); // Depuración
      login({
        id: res.data.usuario_id,
        nombre: res.data.nombre,
        rol: res.data.rol,
      }); // Guarda los datos en el contexto
      message.success(res.data.mensaje);
      navigate("/chat"); // Redirige al chat después de iniciar sesión
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      const errorMessage =
        err.response?.data?.mensaje || "Error al iniciar sesión";
      message.error(errorMessage);

      // Manejo de errores específicos en los campos del formulario
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
    // Manejo de errores de validación del lado del cliente
    console.log("Errores de validación:", errorInfo);
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
          onFinish={handleLogin} // Conecta el método handleLogin al formulario
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
            <Button type="link" onClick={() => navigate("/forgot-password")} block>
              ¿Olvidaste tu contraseña?
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
