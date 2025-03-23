import fs from "fs";
import path from "path";
import { app } from "electron";

export namespace AppConfig {
  export type UserConfig = {
    update?: {
      channel?: string;
    };
  };
}

export class AppConfig {
  private configPath: string;
  private configData: AppConfig.UserConfig;

  constructor() {
    const userDataPath = app.getPath("userData");
    this.configPath = path.join(userDataPath, "user-config.json");
    this.configData = this.loadConfig();
  }

  private loadConfig(): AppConfig.UserConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const rawData = fs.readFileSync(this.configPath, "utf-8");
        return JSON.parse(rawData);
      } else {
        return this.getDefaultConfig();
      }
    } catch (error) {
      console.error("Error loading config:", error);
      return this.getDefaultConfig();
    }
  }

  private saveConfig(): void {
    try {
      const data = JSON.stringify(this.configData, null, 2);
      fs.writeFileSync(this.configPath, data, "utf-8");
    } catch (error) {
      console.error("Error saving config:", error);
    }
  }

  private getDefaultConfig(): AppConfig.UserConfig {
    return {
      update: {
        channel: "latest",
      },
    };
  }

  public get<T>(key: string): T | undefined {
    return getNestedProperty<T>(this.configData, key);
  }

  public getOrThrow<T>(key: string): T {
    const value = this.get<T>(key);
    if (value === undefined) {
      throw new Error(`Config value not found for key: ${key}`);
    }
    return value;
  }

  public set<T>(key: string, value: T): void {
    setNestedProperty(this.configData, key, value);
    this.saveConfig();
  }
}

function getNestedProperty<T>(obj: any, key: string): T | undefined {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function setNestedProperty(obj: any, key: string, value: any): void {
  const parts = key.split(".");
  const last = parts.pop()!;
  const target = parts.reduce((acc, part) => {
    if (!acc[part]) acc[part] = {};
    return acc[part];
  }, obj);
  target[last] = value;
}

export const appConfig = new AppConfig();
