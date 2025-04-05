export interface LoggerService {
  debug?: LogFn;
  log: LogFn;
  warn?: LogFn;
  error: LogFn;
  fatal?: LogFn;
  trace?: LogFn;
}

interface LogFn {
  <T extends object>(obj: T, msg?: string, ...args: any[]): void;
  (obj: unknown, msg?: string, ...args: any[]): void;
  (msg: string, ...args: any[]): void;
}
