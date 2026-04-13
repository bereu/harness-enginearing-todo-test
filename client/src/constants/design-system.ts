/**
 * Design System Constants
 * Centralized design tokens for reuse across components
 */

// Kanban Layout
export const KANBAN_DESIGN = {
  // Column sizing
  columnMinWidth: 300, // pixels
  columnMinHeight: 200, // pixels
  columnGap: 16, // spacing-4

  // Card spacing
  cardMarginBottom: 8, // spacing-2
  cardGap: 0,

  // Drag and drop
  dragOverOpacity: 0.15,
  dragOverTransition: "all 0.2s ease",

  // Interactive states
  cardHoverShadow: "var(--shadow-md)",
  cardHoverBorderColor: "var(--color-neutral-400)",
  cardActiveOpacity: 0.8,

  // Animations
  transitionDuration: "0.2s",
  transitionTiming: "ease",
} as const;

// Button Design
export const BUTTON_DESIGN = {
  // Sizing
  iconButtonSize: 24, // pixels
  iconButtonPadding: 4, // pixels

  // Colors
  primaryBackground: "var(--color-brand-primary)",
  primaryHover: "var(--color-brand-primary-dark)",
  dangerBackground: "var(--color-semantic-error)",
  dangerHover: "#dc2626", // darker red

  // States
  disabledOpacity: 0.6,
  disabledBackground: "var(--color-neutral-500)",
} as const;
