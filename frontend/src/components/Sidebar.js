import React from 'react';
import { Menu, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SolutionOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { SubMenu } = Menu;

function Sidebar({ collapsed, toggleSidebar }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Botón para alternar el sidebar */}
      <div style={{ padding: '10px', textAlign: 'center', background: '#001529' }}>
        <Button
          type="primary"
          onClick={toggleSidebar}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        >
          {collapsed ? '' : 'Cerrar'}
        </Button>
      </div>

      {/* Opciones del sidebar */}
      <Menu
        mode="inline"
        theme="dark"
        style={{ flex: 1, borderRight: 0 }}
      >
        <SubMenu key="director" icon={<UserOutlined />} title="Director">
          <Menu.Item key="director-1">Perfil 1</Menu.Item>
          <Menu.Item key="director-2">Perfil 2</Menu.Item>
        </SubMenu>
        <SubMenu key="estudiante" icon={<BookOutlined />} title="Estudiante">
          <Menu.Item key="estudiante-1">Perfil 1</Menu.Item>
          <Menu.Item key="estudiante-2">Perfil 2</Menu.Item>
        </SubMenu>
        <SubMenu key="padres" icon={<TeamOutlined />} title="Padres">
          <Menu.Item key="padres-1">Perfil 1</Menu.Item>
          <Menu.Item key="padres-2">Perfil 2</Menu.Item>
        </SubMenu>
        <SubMenu key="docente" icon={<SolutionOutlined />} title="Docente">
          <Menu.Item key="docente-1">Perfil 1</Menu.Item>
          <Menu.Item key="docente-2">Perfil 2</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
}

export default Sidebar;