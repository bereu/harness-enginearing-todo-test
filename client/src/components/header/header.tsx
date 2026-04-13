import React, { useState } from "react";
import "./header.css";
import { ProfileButton } from "./profile-button";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
    onToggleSidebar();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="hamburger-button"
          onClick={handleToggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-icon">☰</span>
        </button>
        <h1 className="header-title">📝 Todo App</h1>
      </div>

      <div className="header-center"></div>

      <div className="header-right">
        <ProfileButton />
      </div>
    </header>
  );
}
