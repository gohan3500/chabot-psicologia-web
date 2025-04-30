import React, { useCallback, useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

function ChatLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [chats, setChats] = useState([]);
  const { userData } = useAuth();

  const loadChats = useCallback(async () => {
    if (!userData?.id) return;
    try {
      const res = await axios.get(`/api/chats/user/${userData.id}`);
      setChats(res.data);
    } catch (err) {
      console.error("Error loading chats", err);
    }
  }, [userData]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    const handleRefresh = () => loadChats();
    window.addEventListener("refreshChats", handleRefresh);
    return () => window.removeEventListener("refreshChats", handleRefresh);
  }, [loadChats]);

  const handleNewChat = () => {
    window.location.href = "/chat";
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={270}
        style={{ background: "#001529" }}
      >
        <Sidebar
          collapsed={collapsed}
          toggleSidebar={() => setCollapsed(!collapsed)}
          chats={chats}
          onNewChat={handleNewChat}
          reloadChats={loadChats}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: 20, background: "#f0f2f5" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default ChatLayout;
