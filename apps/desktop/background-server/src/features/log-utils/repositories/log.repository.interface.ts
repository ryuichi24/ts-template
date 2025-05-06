export namespace LogRepository {
  export type Log = {
    id: string;
    name: string;
    level: number;
    content: string;
    loggedAt: Date;
  };

  export type CreateCommand = {
    name: string;
    level: number;
    content: string;
    loggedAt: Date;
  };

  export type GetQuery = {};
}

export interface LogRepository {
  get(query: LogRepository.GetQuery): Promise<LogRepository.Log[]>;
  create(cmd: LogRepository.CreateCommand): Promise<LogRepository.Log>;
  isReady(): Promise<boolean>;
}

export const LogRepository = Symbol("LogRepository");
