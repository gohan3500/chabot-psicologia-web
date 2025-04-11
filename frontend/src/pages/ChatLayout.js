import React, { useState } from "react";
import { Layout } from "antd";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const { Sider, Content } = Layout;

function ChatLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={250}
        style={{ background: "#001529" }}
      >
        <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      </Sider>
      <Layout>
        <Content style={{ padding: "20px", background: "#f0f2f5" }}>
          <Chat />
        </Content>
      </Layout>
    </Layout>
  );
}

export default ChatLayout;
