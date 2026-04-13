import React, { useState } from "react";
import "./layout-wrapper.css";
import { Header } from "../header/header";
import { Sidebar } from "../sidebar/sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="layout-main-content">{children}</main>
    </div>
  );
}
