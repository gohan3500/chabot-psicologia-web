import React from "react";
import { Menu, Button } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // 👈 Importa esto

const { SubMenu } = Menu;

function Sidebar({ collapsed, toggleSidebar }) {
  const navigate = useNavigate(); // 👈 Instancia de navegación

  const handleLogout = () => {
    // Aquí puedes limpiar localStorage o estados de autenticación
    localStorage.clear(); // Si guardas algo del usuario aquí
    navigate("/"); // 👈 Redirige al login
  };

  const menuItems = [
    {
      key: "director",
      icon: <UserOutlined />,
      title: "Director",
      children: [{ key: "director-1", label: "Perfil 1" }],
    },
    {
      key: "estudiante",
      icon: <BookOutlined />,
      title: "Estudiante",
      children: [
        { key: "estudiante-1", label: "Perfil 1" },
        { key: "estudiante-2", label: "Perfil 2" },
      ],
    },
    {
      key: "padres",
      icon: <TeamOutlined />,
      title: "Padres",
      children: [
        { key: "padres-1", label: "Perfil 1" },
        { key: "padres-2", label: "Perfil 2" },
      ],
    },
    {
      key: "docente",
      icon: <SolutionOutlined />,
      title: "Docente",
      children: [
        { key: "docente-1", label: "Perfil 1" },
        { key: "docente-2", label: "Perfil 2" },
      ],
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#001529",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          background: "#002140",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "18px" }}>AI Chat bot</h2>
      </div>

      {/* Toggle Button */}
      <div
        style={{ padding: "10px", textAlign: "center", background: "#001529" }}
      >
        <Button
          type="primary"
          onClick={toggleSidebar}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          style={{ width: "100%", borderRadius: "3px" }}
        >
          {collapsed ? "" : "Cerrar"}
        </Button>
      </div>

      {/* Sidebar Menu */}
      <Menu
        mode="inline"
        theme="dark"
        style={{ flex: 1, borderRight: 0 }}
        defaultOpenKeys={menuItems.map((item) => item.key)}
      >
        {menuItems.map((menu) => (
          <SubMenu key={menu.key} icon={menu.icon} title={menu.title}>
            {menu.children.map((child) => (
              <Menu.Item key={child.key}>{child.label}</Menu.Item>
            ))}
          </SubMenu>
        ))}
      </Menu>

      {/* Footer Section */}
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          background: "#001529",
          borderTop: "1px solid #002140",
        }}
      >
        <Button
          type="link"
          icon={<SettingOutlined />}
          style={{ color: "#fff" }}
        >
          {collapsed ? "" : "Configuración"}
        </Button>
        <div style={{ marginRight: "10px" }}></div>
        <Button
          type="link"
          icon={<LogoutOutlined />}
          style={{ color: "#fff" }}
          onClick={handleLogout} // 👈 Aquí se activa el logout
        >
          {collapsed ? "" : "Salir"}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
