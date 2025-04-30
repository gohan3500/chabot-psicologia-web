import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/ForgotPassword";
import ChatLayout from "./pages/ChatLayout";
import NewChat from "./components/NewChat";
import Chat from "./components/Chat";

import Configuracion from "./pages/Configuracion";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <LoginForm />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <LoginForm />
        }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <ForgotPassword />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/chat" replace /> : <RegisterForm />
        }
      />

      <Route
        path="/chat/*"
        element={
          isAuthenticated ? <ChatLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Navigate to="new-chat" replace />} />

        <Route path="new-chat" element={<NewChat />} />

        <Route path=":chatId" element={<Chat />} />
      </Route>

      <Route
        path="/configuracion"
        element={
          isAuthenticated ? <Configuracion /> : <Navigate to="/login" replace />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
