export interface ILogger {
  debug(message: string | object | undefined | null): void;
  info(message: string | object | undefined | null): void;
  warn(message: string | object | undefined | null): void;
  error(message: string | object | undefined | null): void;
  fatal(message: string | object | undefined | null): void;
}

export class Logger implements ILogger {
  private _strategies: Logger.LogStrategy[] = [];
  private _name: string;

  constructor(props: Logger.Props) {
    this._name = props.name || "Default Logger";
  }

  public addStrategy(strategy: Logger.LogStrategy): this {
    this._strategies.push(strategy);
    return this;
  }

  public setLevel(level: Logger.LogLevel): this {
    this._strategies.forEach((strategy) => strategy.setLevel(level));
    return this;
  }

  private log(level: Logger.LogLevel, message?: string | object | null): void {
    message = this._stringify(message);
    const logPrefix = this._buildPrefix(level);
    this._strategies.forEach((strategy) => strategy.log({ level, message, loggerName: this._name, logPrefix }));
  }

  private _buildPrefix(level: Logger.LogLevel): string {
    return `[${new Date().toUTCString()}][${Logger.LogLevel[level].toUpperCase()}][${this._name}]`;
  }

  private _stringify(message: string | object | undefined | null): string {
    if (typeof message === "object") {
      return JSON.stringify(message, null, 2);
    }
    if (message === undefined) {
      return "undefined";
    }
    if (message === null) {
      return "null";
    }
    return message;
  }

  public debug(message: string | object | undefined | null): void {
    this.log(Logger.LogLevel.DEBUG, message);
  }

  public info(message: string | object | undefined | null): void {
    this.log(Logger.LogLevel.INFO, message);
  }

  public warn(message: string | object | undefined | null): void {
    this.log(Logger.LogLevel.WARN, message);
  }

  public error(message: string | object | undefined | null): void {
    this.log(Logger.LogLevel.ERROR, message);
  }

  public fatal(message: string | object | undefined | null): void {
    this.log(Logger.LogLevel.FATAL, message);
  }
}

export namespace Logger {
  export type Props = { name?: string };
  export enum LogLevel {
    DEBUG = 1,
    INFO,
    WARN,
    ERROR,
    FATAL,
  }

  export type LogPayload = { level: Logger.LogLevel; message: string; loggerName: string; logPrefix: string };

  export interface LogStrategy {
    log(payload: Logger.LogPayload): void;
    setLevel(level: LogLevel): void;
  }

  export abstract class BaseLogStrategy implements Logger.LogStrategy {
    protected currentLevel: Logger.LogLevel = Logger.LogLevel.INFO;

    setLevel(level: Logger.LogLevel): this {
      this.currentLevel = level;
      return this;
    }

    abstract log(payload: Logger.LogPayload): void;

    protected shouldLog(level: Logger.LogLevel): boolean {
      return level >= this.currentLevel;
    }
  }
}
