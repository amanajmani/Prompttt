import pino from 'pino';

// Create logger instance with appropriate configuration for different environments
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'SYS:standard',
      },
    },
  }),
});

export { logger };

// Helper function to create child loggers with context
export function createLogger(context: string) {
  return logger.child({ context });
}

// Helper function to log errors with structured data
export function logError(error: Error, context?: Record<string, any>) {
  logger.error({
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    ...context,
  }, 'Error occurred');
}

// Helper function to log API requests
export function logRequest(
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string
) {
  logger.info({
    method,
    url,
    statusCode,
    duration,
    userId,
  }, 'API request completed');
}