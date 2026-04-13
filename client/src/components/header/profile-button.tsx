import React from "react";
import "./profile-button.css";

interface ProfileButtonProps {
  onClick?: () => void;
}

export function ProfileButton({ onClick }: ProfileButtonProps) {
  return (
    <button
      className="profile-button"
      onClick={onClick}
      title="Open profile menu"
      aria-label="Open profile menu"
    >
      <span className="profile-avatar">👤</span>
      <span className="profile-label">Profile</span>
    </button>
  );
}
