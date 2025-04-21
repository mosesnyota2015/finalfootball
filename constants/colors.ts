export const colors = {
    primary: '#2563eb',     // Blue-600
    primaryDark: "#0d47a1",
    secondary: '#4b5563',   // Gray-600
    secondaryDark: "#1e8e3e",
    background: '#f3f4f6',  // Gray-100
    card: '#ffffff',        // White
    text: '#1f2937',       // Gray-800
    textSecondary: '#6b7280', // Gray-500
    border: '#e5e7eb',     // Gray-200
    error: '#ef4444',      // Red-500
    success: '#22c55e',    // Green-500
    warning: '#f59e0b',    // Amber-500
    info: '#3b82f6',       // Blue-500
    inactive: '#9ca3af',   // Gray-400
    highlight: '#dbeafe',  // Blue-100
    link: '#2563eb',       // Blue-600
    divider: '#e5e7eb',    // Gray-200
    overlay: 'rgba(0, 0, 0, 0.5)',
    transparent: 'transparent',
    positions: {
      GK: "#ffcdd2",
      DEF: "#c8e6c9",
      MID: "#bbdefb",
      FWD: "#ffe0b2"
    }
  } as const;

export type Colors = typeof colors;