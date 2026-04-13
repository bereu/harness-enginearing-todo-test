import "./navigation-item.css";

interface NavigationItemProps {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavigationItem({ label, icon, active = false, onClick }: NavigationItemProps) {
  return (
    <button className={`navigation-item ${active ? "active" : ""}`} onClick={onClick} type="button">
      {icon && <span className="navigation-icon">{icon}</span>}
      <span className="navigation-label">{label}</span>
    </button>
  );
}
