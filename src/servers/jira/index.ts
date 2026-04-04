import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { jiraTools } from './tools';

const server = new McpServer({
  name: 'jira-mcp-server',
  version: '1.0.0',
});

server.tool(
  'search_issues',
  jiraTools.search_issues.description,
  { jql: z.string(), maxResults: z.number().default(20) },
  async (input) => {
    const results = await jiraTools.search_issues.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(results, null, 2) }] };
  },
);

server.tool(
  'create_issue',
  jiraTools.create_issue.description,
  { project: z.string(), summary: z.string(), description: z.string().optional(), issueType: z.enum(['Bug', 'Task', 'Story']).default('Task'), priority: z.enum(['Highest', 'High', 'Medium', 'Low', 'Lowest']).default('Medium') },
  async (input) => {
    const result = await jiraTools.create_issue.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

server.tool(
  'transition_issue',
  jiraTools.transition_issue.description,
  { issueKey: z.string(), transitionName: z.string() },
  async (input) => {
    const result = await jiraTools.transition_issue.handler(input);
    return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
