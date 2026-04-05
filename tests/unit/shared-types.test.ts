import { describe, it, expect } from 'vitest';
import type { ServerConfig, ToolDefinition, ApiClientConfig } from '../../src/shared/types';
import { ApiClient } from '../../src/shared/api-client';

describe('Shared types', () => {
  describe('ApiClientConfig', () => {
    it('should accept valid config with required fields', () => {
      const config: ApiClientConfig = {
        baseUrl: 'https://api.example.com',
        token: 'test-token-123',
      };
      expect(config.baseUrl).toBe('https://api.example.com');
      expect(config.token).toBe('test-token-123');
      expect(config.timeout).toBeUndefined();
    });

    it('should accept config with optional timeout', () => {
      const config: ApiClientConfig = {
        baseUrl: 'https://api.example.com',
        token: 'test-token',
        timeout: 5000,
      };
      expect(config.timeout).toBe(5000);
    });

    it('should be usable with ApiClient constructor', () => {
      const config: ApiClientConfig = {
        baseUrl: 'https://api.example.com',
        token: 'abc',
      };
      const client = new ApiClient(config);
      expect(client).toBeDefined();
    });
  });

  describe('ServerConfig', () => {
    it('should define name, version, and description', () => {
      const config: ServerConfig = {
        name: 'test-server',
        version: '1.0.0',
        description: 'A test MCP server',
      };
      expect(config.name).toBe('test-server');
      expect(config.version).toBe('1.0.0');
      expect(config.description).toBe('A test MCP server');
    });

    it('should enforce all required fields at type level', () => {
      const config: ServerConfig = {
        name: 'github-mcp-server',
        version: '2.0.0',
        description: 'GitHub integration for MCP',
      };
      expect(Object.keys(config)).toHaveLength(3);
      expect(Object.keys(config)).toEqual(
        expect.arrayContaining(['name', 'version', 'description']),
      );
    });
  });

  describe('ToolDefinition', () => {
    it('should define name, description, and inputSchema', () => {
      const tool: ToolDefinition = {
        name: 'list_repos',
        description: 'List repositories',
        inputSchema: { type: 'object', properties: { owner: { type: 'string' } } },
      };
      expect(tool.name).toBe('list_repos');
      expect(tool.description).toBe('List repositories');
      expect(tool.inputSchema).toHaveProperty('type', 'object');
    });

    it('should accept arbitrary inputSchema shapes', () => {
      const tool: ToolDefinition = {
        name: 'complex_tool',
        description: 'A tool with nested schema',
        inputSchema: {
          type: 'object',
          required: ['query'],
          properties: {
            query: { type: 'string' },
            options: { type: 'object', properties: { limit: { type: 'number' } } },
          },
        },
      };
      expect(tool.inputSchema).toHaveProperty('required');
      expect(tool.inputSchema).toHaveProperty('properties');
    });
  });
});
