import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { slackTools } from './tools';

const server = new McpServer({
  name: 'slack-mcp-server',
  version: '1.0.0',
});

server.tool(
  'send_message',
  slackTools.send_message.description,
  { channel: z.string(), text: z.string(), thread_ts: z.string().optional() },
  async (input) => {
    const result = await slackTools.send_message.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'list_channels',
  slackTools.list_channels.description,
  { limit: z.number().default(100), types: z.string().default('public_channel') },
  async (input) => {
    const results = await slackTools.list_channels.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }] };
  },
);

server.tool(
  'search_messages',
  slackTools.search_messages.description,
  { query: z.string(), count: z.number().default(20) },
  async (input) => {
    const result = await slackTools.search_messages.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
