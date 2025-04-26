import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ChatLayout from "./pages/ChatLayout";
import Configuracion from "./pages/Configuracion";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/chat" /> : <LoginForm />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/chat" /> : <LoginForm />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/chat" /> : <RegisterForm />}
      />
      <Route
        path="/chat"
        element={isAuthenticated ? <ChatLayout /> : <Navigate to="/login" />}
      />
      <Route
        path="/configuracion"
        element={isAuthenticated ? <Configuracion /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
