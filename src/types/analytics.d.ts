// Type definitions for optional analytics packages

declare module '@vercel/analytics/react' {
  export const Analytics: React.ComponentType;
}

// Global analytics interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: {
        custom_map?: Record<string, string>;
        value?: number;
        event_category?: string;
        event_label?: string;
        non_interaction?: boolean;
      }
    ) => void;
  }
}

// Ensure this file is treated as a module
export {};
