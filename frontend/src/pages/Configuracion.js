import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  List,
  Typography,
  Card,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../context/axiosInstance";

const { Title, Paragraph } = Typography;

const RoleItem = ({ item, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombre_rol: item.nombre_rol,
    descripcion: item.descripcion || "",
  });

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(`/roles/update-role/${item.id}`, editData);
      message.success("Rol actualizado");
      onUpdate(item.id, editData);
      setIsEditing(false);
    } catch (err) {
      message.error("Error al actualizar el rol");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/roles/delete-role/${item.id}`);
      onDelete(item.id);
      message.success("Rol eliminado");
    } catch (err) {
      message.error("Error al eliminar el rol");
    }
  };

  return (
    <List.Item
      actions={
        isEditing
          ? [
              <Button
                icon={<SaveOutlined />}
                onClick={handleUpdate}
                type="link"
              />,
              <Button
                icon={<CloseOutlined />}
                onClick={() => setIsEditing(false)}
                type="link"
              />,
            ]
          : [
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                type="link"
              />,
              <Popconfirm
                title="¿Eliminar este rol?"
                onConfirm={handleDelete}
                okText="Sí"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} danger type="link" />
              </Popconfirm>,
            ]
      }
    >
      {isEditing ? (
        <div>
          <Input
            value={editData.nombre_rol}
            onChange={(e) =>
              setEditData({ ...editData, nombre_rol: e.target.value })
            }
            style={{ marginBottom: 8 }}
          />
          <Input.TextArea
            value={editData.descripcion}
            rows={4}
            onChange={(e) =>
              setEditData({ ...editData, descripcion: e.target.value })
            }
          />
        </div>
      ) : (
        <List.Item.Meta
          title={<strong>{item.nombre_rol}</strong>}
          description={
            <Paragraph style={{ marginBottom: 0 }}>
              {item.descripcion || <em>Sin descripción</em>}
            </Paragraph>
          }
        />
      )}
    </List.Item>
  );
};

const Configuracion = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get("/roles/list-roles");
        setRoles(res.data);
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
        descripcion: values.descripcion,
      });
      message.success(res.data.mensaje);
      setRoles((prev) => [
        ...prev,
        {
          id: res.data.id || Date.now(), // fallback if backend doesn't return ID
          nombre_rol: values.nombre_rol,
          descripcion: values.descripcion,
        },
      ]);
      form.resetFields();
      setLoading(false);
    } catch (err) {
      console.error("Error al crear el rol:", err);
      const errorMessage =
        err.response?.data?.mensaje || "Error al crear el rol";
      message.error(errorMessage);
      setLoading(false);
    }
  };

  const updateRoleInState = (id, updatedData) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === id ? { ...role, ...updatedData } : role))
    );
  };

  const deleteRoleFromState = (id) => {
    setRoles((prev) => prev.filter((role) => role.id !== id));
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
          padding: "24px",
          overflowY: "auto",
          transition: "margin-left 0.2s ease",
          background: "#f0f2f5",
        }}
      >
        <Title level={2}>Configuración</Title>

        <Card title="Crear Nuevo Rol" style={{ marginBottom: 32 }}>
          <Form
            form={form}
            onFinish={handleCreateRole}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="nombre_rol"
              label="Nombre del Rol"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre del rol",
                },
              ]}
            >
              <Input placeholder="Ejemplo: Psicólogo, Estudiante, etc." />
            </Form.Item>

            <Form.Item
              name="descripcion"
              label="Descripción del Rol"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa una descripción",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Descripción del comportamiento del rol en la simulación..."
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Crear Rol
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Roles Existentes">
          <List
            itemLayout="vertical"
            dataSource={roles}
            renderItem={(item) => (
              <RoleItem
                item={item}
                onUpdate={updateRoleInState}
                onDelete={deleteRoleFromState}
              />
            )}
          />
        </Card>
      </div>
    </div>
  );
};

export default Configuracion;
