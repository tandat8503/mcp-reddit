import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export interface ServerConfig {
  // Reddit API Configuration
  redditClientId: string;
  redditClientSecret: string;
  redditUserAgent: string;
  redditRedirectUri: string;
  redditOAuthScopes: string[];
  timeoutSeconds: number;
}

export class ConfigService {
  private static instance: ConfigService;
  private config: ServerConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): ServerConfig {
    return this.config;
  }

  private loadConfig(): ServerConfig {
    return {
      // Reddit API Configuration
      redditClientId: this.getRequiredEnv("REDDIT_CLIENT_ID"),
      redditClientSecret: this.getRequiredEnv("REDDIT_CLIENT_SECRET"),
      redditUserAgent: this.getEnv(
        "REDDIT_USER_AGENT",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      ),
      redditRedirectUri: this.getEnv(
        "REDDIT_REDIRECT_URI",
        "http://localhost:8080/callback"
      ),
      redditOAuthScopes: this.getEnv(
        "REDDIT_OAUTH_SCOPES",
        "read submit vote history privatemessages subscribe"
      ).split(" "),
      timeoutSeconds: this.getNumberEnv("TIMEOUT_SECONDS", 30),
    };
  }

  private getRequiredEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  private getEnv(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getNumberEnv(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return defaultValue;
    }
    return num;
  }
}

export const config = ConfigService.getInstance().getConfig();
