import "./sidebar.css";
import { NavigationItem } from "./navigation-item";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NAVIGATION_ITEMS = [
  { id: "my-tasks", label: "My Tasks", icon: "📋" },
  { id: "important", label: "Important", icon: "⭐" },
  { id: "planned", label: "Planned", icon: "📅" },
];

export function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <nav className="sidebar-nav">
        <h3 className="sidebar-title">Navigation</h3>
        <ul className="sidebar-menu">
          {NAVIGATION_ITEMS.map((item) => (
            <li key={item.id}>
              <NavigationItem label={item.label} icon={item.icon} />
            </li>
          ))}
        </ul>
      </nav>

      <section className="sidebar-labels">
        <h3 className="sidebar-section-title">Labels</h3>
        <p className="sidebar-placeholder">Labels coming soon</p>
      </section>
    </aside>
  );
}
