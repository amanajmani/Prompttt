// Enterprise-grade mock for isows library
// This mock provides the essential WebSocket functionality needed for Supabase realtime
module.exports = {
  getNativeWebSocket: jest.fn(() => {
    // Return a mock WebSocket constructor that matches the expected interface
    return class MockWebSocket {
      constructor(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        this.readyState = 1; // OPEN
        this.onopen = null;
        this.onclose = null;
        this.onmessage = null;
        this.onerror = null;
      }

      send() {
        // Mock send implementation
      }

      close(code, reason) {
        // Mock close implementation
        if (this.onclose) {
          this.onclose({ code, reason });
        }
      }
    };
  }),

  // Additional exports that might be needed
  WebSocket: class MockWebSocket {
    constructor(url, protocols) {
      this.url = url;
      this.protocols = protocols;
      this.readyState = 1;
    }
    send() {}
    close() {}
  },

  // Constants that might be referenced
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};
