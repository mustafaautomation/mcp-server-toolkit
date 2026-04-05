import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const serversDir = path.resolve(__dirname, '../../src/servers');
const serverNames = ['github', 'jira', 'postgres', 'slack'];

describe('Server index modules', () => {
  it.each(serverNames)('%s/index.ts should exist', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  it.each(serverNames)('%s/tools.ts should exist', (server) => {
    const toolsPath = path.join(serversDir, server, 'tools.ts');
    expect(fs.existsSync(toolsPath)).toBe(true);
  });

  it.each(serverNames)('%s/index.ts should import from tools', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain("from './tools'");
  });

  it.each(serverNames)('%s/index.ts should create an McpServer', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('new McpServer');
  });

  it.each(serverNames)('%s/index.ts should register at least one tool', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    const toolRegistrations = (content.match(/server\.tool\(/g) || []).length;
    expect(toolRegistrations).toBeGreaterThanOrEqual(1);
  });

  it.each(serverNames)('%s/index.ts should define a main function with transport', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain('async function main');
    expect(content).toContain('StdioServerTransport');
    expect(content).toContain('server.connect');
  });

  it.each(serverNames)('%s/index.ts should set correct server name', (server) => {
    const indexPath = path.join(serversDir, server, 'index.ts');
    const content = fs.readFileSync(indexPath, 'utf-8');
    expect(content).toContain(`name: '${server}-mcp-server'`);
  });

  describe('tools modules export correctly', () => {
    it('github tools should export githubTools', async () => {
      const { githubTools } = await import('../../src/servers/github/tools');
      expect(githubTools).toBeDefined();
      expect(Object.keys(githubTools).length).toBeGreaterThanOrEqual(1);
      for (const tool of Object.values(githubTools)) {
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('handler');
        expect(tool).toHaveProperty('inputSchema');
      }
    });

    it('jira tools should export jiraTools', async () => {
      const { jiraTools } = await import('../../src/servers/jira/tools');
      expect(jiraTools).toBeDefined();
      expect(Object.keys(jiraTools).length).toBeGreaterThanOrEqual(1);
      for (const tool of Object.values(jiraTools)) {
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('handler');
        expect(tool).toHaveProperty('inputSchema');
      }
    });

    it('postgres tools should export postgresTools', async () => {
      const { postgresTools } = await import('../../src/servers/postgres/tools');
      expect(postgresTools).toBeDefined();
      expect(Object.keys(postgresTools).length).toBeGreaterThanOrEqual(1);
      for (const tool of Object.values(postgresTools)) {
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('handler');
        expect(tool).toHaveProperty('inputSchema');
      }
    });

    it('slack tools should export slackTools', async () => {
      const { slackTools } = await import('../../src/servers/slack/tools');
      expect(slackTools).toBeDefined();
      expect(Object.keys(slackTools).length).toBeGreaterThanOrEqual(1);
      for (const tool of Object.values(slackTools)) {
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('handler');
        expect(tool).toHaveProperty('inputSchema');
      }
    });
  });
});
