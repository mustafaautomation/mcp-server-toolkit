import { z } from 'zod';
import { ApiClient } from '../../shared/api-client';

function createJiraClient() {
  const host = process.env.JIRA_HOST || 'your-domain.atlassian.net';
  const email = process.env.JIRA_EMAIL || '';
  const token = process.env.JIRA_API_TOKEN || '';
  const auth = Buffer.from(`${email}:${token}`).toString('base64');

  return new ApiClient({
    baseUrl: `https://${host}/rest/api/3`,
    token: auth,
  });
}

export const jiraTools = {
  search_issues: {
    description: 'Search Jira issues using JQL',
    inputSchema: z.object({
      jql: z.string().describe('JQL query string'),
      maxResults: z.number().default(20),
    }),
    handler: async (input: { jql: string; maxResults: number }) => {
      const client = createJiraClient();
      const data = await client.get<{ issues: Array<{ key: string; fields: { summary: string; status: { name: string }; assignee?: { displayName: string } } }> }>(
        `/search?jql=${encodeURIComponent(input.jql)}&maxResults=${input.maxResults}`,
      );
      return data.issues.map((i) => ({
        key: i.key,
        summary: i.fields.summary,
        status: i.fields.status.name,
        assignee: i.fields.assignee?.displayName || 'Unassigned',
      }));
    },
  },

  create_issue: {
    description: 'Create a new Jira issue',
    inputSchema: z.object({
      project: z.string().describe('Project key (e.g., QA)'),
      summary: z.string(),
      description: z.string().optional(),
      issueType: z.enum(['Bug', 'Task', 'Story']).default('Task'),
      priority: z.enum(['Highest', 'High', 'Medium', 'Low', 'Lowest']).default('Medium'),
    }),
    handler: async (input: { project: string; summary: string; description?: string; issueType: string; priority: string }) => {
      const client = createJiraClient();
      return client.post('/issue', {
        fields: {
          project: { key: input.project },
          summary: input.summary,
          description: input.description ? { type: 'doc', version: 1, content: [{ type: 'paragraph', content: [{ type: 'text', text: input.description }] }] } : undefined,
          issuetype: { name: input.issueType },
          priority: { name: input.priority },
        },
      });
    },
  },

  transition_issue: {
    description: 'Transition a Jira issue to a new status',
    inputSchema: z.object({
      issueKey: z.string().describe('Issue key (e.g., QA-123)'),
      transitionName: z.string().describe('Target status name'),
    }),
    handler: async (input: { issueKey: string; transitionName: string }) => {
      const client = createJiraClient();
      const transitions = await client.get<{ transitions: Array<{ id: string; name: string }> }>(
        `/issue/${input.issueKey}/transitions`,
      );
      const target = transitions.transitions.find((t) => t.name.toLowerCase() === input.transitionName.toLowerCase());
      if (!target) throw new Error(`Transition "${input.transitionName}" not found`);
      await client.post(`/issue/${input.issueKey}/transitions`, { transition: { id: target.id } });
      return { success: true, issueKey: input.issueKey, newStatus: input.transitionName };
    },
  },
};
