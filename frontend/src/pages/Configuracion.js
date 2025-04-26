import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, List } from "antd";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../context/axiosInstance";

const Configuracion = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar roles existentes al iniciar la página
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles/list-roles");
        setRoles(res.data); // Actualiza el estado con los roles obtenidos
      } catch (err) {
        console.error("Error al cargar los roles:", err);
        message.error("Error al cargar los roles existentes");
      }
    };

    fetchRoles();
  }, []);

  const handleCreateRole = async (values) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/roles/create-role", {
        nombre_rol: values.nombre_rol,
      });
      message.success(res.data.mensaje);
      setRoles((prevRoles) => [...prevRoles, { nombre_rol: values.nombre_rol }]);
      setLoading(false);
    } catch (err) {
      console.error("Error al crear el rol:", err);
      const errorMessage = err.response?.data?.mensaje || "Error al crear el rol";
      message.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
        onCustomAction={() => navigate("/chat")}
        customButtonText="Regresar al Chat"
      />

      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
          marginLeft: collapsed ? "80px" : "200px",
          transition: "margin-left 0.2s ease",
        }}
      >
        <h2>Configuración</h2>

        <h3>Crear Rol de Entrenamiento</h3>
        <Form onFinish={handleCreateRole} layout="vertical">
          <Form.Item
            name="nombre_rol"
            label="Nombre del Rol"
            rules={[{ required: true, message: "Por favor ingresa el nombre del rol" }]}
          >
            <Input placeholder="Ejemplo: Psicólogo, Estudiante, etc." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Crear Rol
            </Button>
          </Form.Item>
        </Form>

        <h3>Roles Existentes</h3>
        <List
          bordered
          dataSource={roles}
          renderItem={(item) => <List.Item>{item.nombre_rol}</List.Item>}
        />
      </div>
    </div>
  );
};

export default Configuracion;