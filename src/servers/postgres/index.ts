import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { postgresTools } from './tools';

const server = new McpServer({
  name: 'postgres-mcp-server',
  version: '1.0.0',
});

server.tool(
  'query',
  postgresTools.query.description,
  { sql: z.string(), params: z.array(z.unknown()).optional() },
  async (input) => {
    const result = await postgresTools.query.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'list_tables',
  postgresTools.list_tables.description,
  { schema: z.string().default('public') },
  async (input) => {
    const result = await postgresTools.list_tables.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'describe_table',
  postgresTools.describe_table.description,
  { table: z.string(), schema: z.string().default('public') },
  async (input) => {
    const result = await postgresTools.describe_table.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
