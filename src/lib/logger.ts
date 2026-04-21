
type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 100;

  private log(level: LogLevel, message: string, context?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    // Console output for development/real-time monitoring
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, context || '');

    this.logs.push(entry);

    // Keep memory usage in check
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // In a real production app, we would send this to an external service here
    // e.g., Sentry, LogRocket, or a custom /api/logs endpoint
  }

  info(message: string, context?: any) {
    this.log('info', message, context);
  }

  warn(message: string, context?: any) {
    this.log('warn', message, context);
  }

  error(message: string, context?: any) {
    this.log('error', message, context);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
