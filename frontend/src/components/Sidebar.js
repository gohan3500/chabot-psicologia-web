import React from "react";
import { Button, List, Avatar, Tooltip, Popconfirm } from "antd";
import {
  MessageOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  SettingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Sidebar({
  collapsed,
  toggleSidebar,
  chats = [],
  onNewChat,
  customButtonText,
  onCustomAction,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();

  const activeChatId = location.pathname.split("/chat/")[1];

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`/api/delete_chats/${chatId}`, {
        params: { user_id: userData.id },
      });
      window.dispatchEvent(new Event("refreshChats"));
      if (location.pathname === `/chat/${chatId}`) {
        navigate("/chat"); // redirect if the deleted chat was open
      }
    } catch (err) {
      console.error("Error deleting chat", err);
    }
  };

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
      {/* Header */}
      <div
        style={{
          padding: 20,
          textAlign: "center",
          background: "#002140",
          color: "#fff",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", whiteSpace: "nowrap" }}>
          {collapsed ? "AI" : "Chatbot de Psicología"}
        </h2>
      </div>

      {/* Toggle */}
      <div style={{ padding: "10px", textAlign: "center" }}>
        <Button
          type="primary"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ width: "100%" }}
        >
          {collapsed ? "" : "Ocultar"}
        </Button>
      </div>

      {/* New Chat */}
      <div style={{ padding: "10px", marginBottom: "5px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          block
          onClick={onCustomAction || onNewChat}
        >
          {collapsed ? "" : customButtonText || "Nuevo Chat"}
        </Button>
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <List
          dataSource={chats}
          renderItem={(chat) => {
            const isActive = chat.id === activeChatId;
            return (
              <Tooltip
                title={collapsed && (chat.title || "Entrevista sin título")}
                placement="right"
                disabled={!collapsed}
              >
                <List.Item
                  style={{
                    padding: "10px 20px",
                    background: isActive ? "#1890ff33" : "inherit",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  actions={[
                    <Popconfirm
                      title="¿Eliminar este chat?"
                      onConfirm={() => handleDeleteChat(chat.id)}
                      okText="Sí"
                      cancelText="No"
                    >
                      {!collapsed && (
                        <DeleteOutlined style={{ color: "#ff4d4f" }} />
                      )}
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={<MessageOutlined />}
                        style={{
                          backgroundColor: isActive ? "#1890ff" : "#ccc",
                        }}
                      />
                    }
                    title={
                      <span style={{ color: "#fff" }}>
                        {!collapsed && (chat.title || "Entrevista sin título")}
                      </span>
                    }
                    description={
                      !collapsed && (
                        <span style={{ color: "#aaa", fontSize: "12px" }}>
                          {(chat.lastMessage || "").slice(0, 40)}...
                        </span>
                      )
                    }
                  />
                </List.Item>
              </Tooltip>
            );
          }}
        />
      </div>

      {/* Configuración */}
      {userData?.rol === "Director" && (
        <div style={{ padding: "10px", borderTop: "1px solid #002140" }}>
          <Tooltip
            title="Configuración"
            placement="right"
            disabled={!collapsed}
          >
            <Button
              type="link"
              icon={<SettingOutlined />}
              style={{ color: "#fff" }}
              block
              onClick={() => navigate("/configuracion")}
            >
              {collapsed ? "" : "Configuración"}
            </Button>
          </Tooltip>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: "10px", borderTop: "1px solid #002140" }}>
        <Tooltip title="Salir" placement="right" disabled={!collapsed}>
          <Button
            type="link"
            icon={<LogoutOutlined />}
            style={{ color: "#fff" }}
            block
            onClick={handleLogout}
          >
            {collapsed ? "" : "Salir"}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;
