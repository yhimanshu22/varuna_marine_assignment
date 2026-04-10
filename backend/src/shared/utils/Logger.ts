/**
 * Simple dependency-free logger with professional formatting.
 */
export class Logger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  static info(message: string, context?: any) {
    console.log(`[${this.getTimestamp()}] [INFO] ${message}`, context || "");
  }

  static warn(message: string, context?: any) {
    console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, context || "");
  }

  static error(message: string, error?: any) {
    console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, error || "");
  }

  static debug(message: string, context?: any) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[${this.getTimestamp()}] [DEBUG] ${message}`, context || "");
    }
  }
}
