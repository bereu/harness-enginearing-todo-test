# Layout & Templates

Structural patterns for the TODO application.

## App View Structure

The main application uses a three-part layout to manage tasks effectively.

### 1. Header (Top Navigation)

- **Brand/Title:** App name "Todo App".
- **Actions:** View toggle (List vs Kanban).
- **Profile:** Profile button/avatar located at the far right for user settings and account management.

### 2. Sidebar (Left Navigation)

- **Menu:** Hamburger menu toggle for collapsing/expanding.
- **Content:** Navigation links for different project views, filters (e.g., "My Tasks", "Important", "Planned"), and labels.
- **Behavior:** Persistent on desktop, collapsible drawer on mobile.

### 3. Main Content (Kanban Style)

- **Primary View:** Kanban board with status columns (e.g., "To Do", "In Progress", "Done").
- **Layout:** Horizontal scrolling for columns on smaller screens, responsive grid on larger screens.
- **Interaction:** Drag-and-drop support for cards between columns.
- **Constraints:** Max-width `1200px` container for the content area.

## LP (Landing Page) Structure

- **Hero Section:** Centered heading (`H1`), vibrant gradient background.
- **Action Area:** Primary call-to-action (CTA) button (`Button primary`).
- **Feature Grid:** Cards illustrating app capabilities.

## Template Specifications

- **Spacing:** Minimum `16px` padding on all screen edges.
- **Breakpoints:** `768px` (Mobile), `1024px` (Tablet), `1200px` (Desktop).
- **Z-Index Scale:**
  - `Header`: 100
  - `Sidebar`: 200 (when open on mobile)
  - `Modal`: 300
