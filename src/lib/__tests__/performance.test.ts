import {
  getDeviceType,
  getConnectionType,
  rateMetric,
  PERFORMANCE_THRESHOLDS,
} from '../performance';

// Mock window and navigator
const mockWindow = {
  innerWidth: 1024,
  location: { href: 'https://example.com' },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  connection: {
    effectiveType: '4g',
  },
};

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('Performance Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeviceType', () => {
    it('returns mobile for small screens', () => {
      mockWindow.innerWidth = 600;
      expect(getDeviceType()).toBe('mobile');
    });

    it('returns tablet for medium screens', () => {
      mockWindow.innerWidth = 900;
      expect(getDeviceType()).toBe('tablet');
    });

    it('returns desktop for large screens', () => {
      mockWindow.innerWidth = 1400;
      expect(getDeviceType()).toBe('desktop');
    });

    it('returns mobile for mobile user agents', () => {
      mockWindow.innerWidth = 1400;
      mockNavigator.userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      expect(getDeviceType()).toBe('mobile');
    });

    it('returns tablet for tablet user agents', () => {
      mockWindow.innerWidth = 1400;
      mockNavigator.userAgent = 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)';
      expect(getDeviceType()).toBe('tablet');
    });
  });

  describe('getConnectionType', () => {
    it('returns connection effective type when available', () => {
      expect(getConnectionType()).toBe('4g');
    });

    it('returns unknown when connection API not available', () => {
      const originalConnection = mockNavigator.connection;
      delete (mockNavigator as any).connection;

      expect(getConnectionType()).toBe('unknown');

      mockNavigator.connection = originalConnection;
    });
  });

  describe('rateMetric', () => {
    it('rates LCP correctly', () => {
      expect(rateMetric('LCP', 2000)).toBe('good');
      expect(rateMetric('LCP', 3000)).toBe('needs-improvement');
      expect(rateMetric('LCP', 5000)).toBe('poor');
    });

    it('rates FID correctly', () => {
      expect(rateMetric('FID', 50)).toBe('good');
      expect(rateMetric('FID', 200)).toBe('needs-improvement');
      expect(rateMetric('FID', 400)).toBe('poor');
    });

    it('rates CLS correctly', () => {
      expect(rateMetric('CLS', 0.05)).toBe('good');
      expect(rateMetric('CLS', 0.15)).toBe('needs-improvement');
      expect(rateMetric('CLS', 0.3)).toBe('poor');
    });

    it('returns good for unknown metrics', () => {
      expect(rateMetric('UNKNOWN_METRIC', 1000)).toBe('good');
    });
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('has correct LCP thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.LCP.GOOD).toBe(2500);
      expect(PERFORMANCE_THRESHOLDS.LCP.NEEDS_IMPROVEMENT).toBe(4000);
    });

    it('has correct FID thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.FID.GOOD).toBe(100);
      expect(PERFORMANCE_THRESHOLDS.FID.NEEDS_IMPROVEMENT).toBe(300);
    });

    it('has correct CLS thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.CLS.GOOD).toBe(0.1);
      expect(PERFORMANCE_THRESHOLDS.CLS.NEEDS_IMPROVEMENT).toBe(0.25);
    });

    it('has correct touch response thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.TOUCH_RESPONSE.GOOD).toBe(50);
      expect(PERFORMANCE_THRESHOLDS.TOUCH_RESPONSE.NEEDS_IMPROVEMENT).toBe(100);
    });
  });
});
