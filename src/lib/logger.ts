type LogLevel = "info" | "warn" | "error";

/**
 * Logger mínimo para centralizar los logs de la capa de datos.
 * Sustituye llamadas sueltas a `console.error` por una salida consistente.
 */
function log(level: LogLevel, message: string, context?: unknown): void {
  const prefix = `[shadow-link] ${message}`;
  const args: [string, ...unknown[]] =
    context === undefined ? [prefix] : [prefix, context];

  switch (level) {
    case "info":
      console.info(...args);
      return;
    case "warn":
      console.warn(...args);
      return;
    case "error":
      console.error(...args);
      return;
  }
}

export const logger = {
  info(message: string, context?: unknown): void {
    log("info", message, context);
  },
  warn(message: string, context?: unknown): void {
    log("warn", message, context);
  },
  error(message: string, context?: unknown): void {
    log("error", message, context);
  },
};
