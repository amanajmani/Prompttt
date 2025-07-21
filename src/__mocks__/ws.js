// Enterprise-grade mock for ws library
// This provides a complete WebSocket mock that satisfies Node.js WebSocket requirements
module.exports = class MockWebSocket {
  constructor(url, protocols, options) {
    this.url = url;
    this.protocols = protocols || [];
    this.options = options || {};
    this.readyState = MockWebSocket.OPEN;
    this.bufferedAmount = 0;
    this.extensions = '';
    this.protocol = '';

    // Event handlers
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;

    // Simulate connection opening
    setTimeout(() => {
      if (this.onopen) {
        this.onopen({ target: this });
      }
    }, 0);
  }

  send() {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    // Mock send - in real implementation this would transmit data
  }

  close(code = 1000, reason = '') {
    if (
      this.readyState === MockWebSocket.CLOSED ||
      this.readyState === MockWebSocket.CLOSING
    ) {
      return;
    }

    this.readyState = MockWebSocket.CLOSING;

    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      if (this.onclose) {
        this.onclose({
          target: this,
          code,
          reason,
          wasClean: code === 1000,
        });
      }
    }, 0);
  }

  ping(data, _mask, callback) {
    // Mock ping implementation
    if (typeof data === 'function') {
      callback = data;
    }
    if (callback) callback();
  }

  pong(data, _mask, callback) {
    // Mock pong implementation
    if (typeof data === 'function') {
      callback = data;
      data = Buffer.alloc(0);
    }
    if (callback) callback();
  }

  addEventListener(type, listener) {
    // Mock event listener implementation
    this[`on${type}`] = listener;
  }

  removeEventListener(type, listener) {
    // Mock event listener removal
    if (this[`on${type}`] === listener) {
      this[`on${type}`] = null;
    }
  }

  // WebSocket ready state constants
  static get CONNECTING() {
    return 0;
  }
  static get OPEN() {
    return 1;
  }
  static get CLOSING() {
    return 2;
  }
  static get CLOSED() {
    return 3;
  }
};

// Also export constants for direct access
module.exports.CONNECTING = 0;
module.exports.OPEN = 1;
module.exports.CLOSING = 2;
module.exports.CLOSED = 3;
