import React from "react";
import { Button, List, Avatar } from "antd";
import {
  MessageOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Sidebar({ collapsed, toggleSidebar, chats, onNewChat, customButtonText, onCustomAction }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

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
        <h2 style={{ margin: 0, fontSize: "24px" }}>
          {collapsed ? "AI" : "Chatbot de Psicología"}
        </h2>
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

      {/* Custom Button */}
      <div
        style={{
          padding: "10px",
          textAlign: "center",
          background: "#001529",
          borderBottom: "1px solid #002140",
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ width: "100%", borderRadius: "3px" }}
          onClick={onCustomAction || onNewChat}
        >
          {collapsed ? "" : customButtonText || "Nuevo Chat"}
        </Button>
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: "auto", background: "#001529" }}>
        <List
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              style={{ padding: "10px 20px", cursor: "pointer" }}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<MessageOutlined />} />}
                title={<span style={{ color: "#fff" }}>{chat.name}</span>}
                description={
                  <span style={{ color: "#aaa" }}>{chat.lastMessage}</span>
                }
              />
            </List.Item>
          )}
        />
      </div>

      {/* Configuración */}
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
          onClick={() => navigate("/configuracion")}
        >
          {collapsed ? "" : "Configuración"}
        </Button>
      </div>

      {/* Salir */}
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
          icon={<LogoutOutlined />}
          style={{ color: "#fff" }}
          onClick={handleLogout}
        >
          {collapsed ? "" : "Salir"}
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
