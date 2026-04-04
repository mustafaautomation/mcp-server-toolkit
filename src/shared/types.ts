export interface ServerConfig {
  name: string;
  version: string;
  description: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ApiClientConfig {
  baseUrl: string;
  token: string;
  timeout?: number;
}
