export class Logger {
  private strategies: Logger.LogStrategy[] = [];
  private globalLevel: Logger.LogLevel = Logger.LogLevel.DEBUG;

  public addStrategy(strategy: Logger.LogStrategy): this {
    this.strategies.push(strategy);
    return this;
  }

  public setLevel(level: Logger.LogLevel): this {
    this.globalLevel = level;
    this.strategies.forEach((strategy) => strategy.setLevel(level));
    return this;
  }

  private log(level: Logger.LogLevel, message: string): void {
    this.strategies.forEach((strategy) => strategy.log(level, message));
  }

  public debug(message: string): void {
    this.log(Logger.LogLevel.DEBUG, message);
  }

  public info(message: string): void {
    this.log(Logger.LogLevel.INFO, message);
  }

  public warn(message: string): void {
    this.log(Logger.LogLevel.WARN, message);
  }

  public error(message: string): void {
    this.log(Logger.LogLevel.ERROR, message);
  }

  public fatal(message: string): void {
    this.log(Logger.LogLevel.FATAL, message);
  }
}

export namespace Logger {
  export enum LogLevel {
    DEBUG = 1,
    INFO,
    WARN,
    ERROR,
    FATAL,
  }

  export interface LogStrategy {
    log(level: LogLevel, message: string): void;
    setLevel(level: LogLevel): void;
  }

  export abstract class BaseLogStrategy implements Logger.LogStrategy {
    protected currentLevel: Logger.LogLevel = Logger.LogLevel.DEBUG;

    setLevel(level: Logger.LogLevel): this {
      this.currentLevel = level;
      return this;
    }

    abstract log(level: Logger.LogLevel, message: string): void;

    protected shouldLog(level: Logger.LogLevel): boolean {
      return level >= this.currentLevel;
    }
  }
}
