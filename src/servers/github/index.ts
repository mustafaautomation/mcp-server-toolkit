import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { githubTools } from './tools';

const server = new McpServer({
  name: 'github-mcp-server',
  version: '1.0.0',
});

// Register tools
server.tool(
  'list_repos',
  githubTools.list_repos.description,
  { owner: z.string(), type: z.enum(['all', 'public', 'private']).default('all'), per_page: z.number().default(30) },
  async (input) => {
    const results = await githubTools.list_repos.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }] };
  },
);

server.tool(
  'get_pull_requests',
  githubTools.get_pull_requests.description,
  { owner: z.string(), repo: z.string(), state: z.enum(['open', 'closed', 'all']).default('open') },
  async (input) => {
    const results = await githubTools.get_pull_requests.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }] };
  },
);

server.tool(
  'create_issue',
  githubTools.create_issue.description,
  { owner: z.string(), repo: z.string(), title: z.string(), body: z.string().optional(), labels: z.array(z.string()).optional() },
  async (input) => {
    const result = await githubTools.create_issue.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'get_workflow_runs',
  githubTools.get_workflow_runs.description,
  { owner: z.string(), repo: z.string(), per_page: z.number().default(10) },
  async (input) => {
    const results = await githubTools.get_workflow_runs.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }] };
  },
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
