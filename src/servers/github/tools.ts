import { z } from 'zod';
import { ApiClient } from '../../shared/api-client';

const client = new ApiClient({
  baseUrl: 'https://api.github.com',
  token: process.env.GITHUB_TOKEN || '',
});

export const githubTools = {
  list_repos: {
    description: 'List repositories for a user or organization',
    inputSchema: z.object({
      owner: z.string().describe('GitHub username or org name'),
      type: z.enum(['all', 'public', 'private']).default('all'),
      per_page: z.number().default(30),
    }),
    handler: async (input: { owner: string; type: string; per_page: number }) => {
      const repos = await client.get<
        Array<{ full_name: string; description: string; stargazers_count: number }>
      >(`/users/${input.owner}/repos?type=${input.type}&per_page=${input.per_page}&sort=updated`);
      return repos.map((r) => ({
        name: r.full_name,
        description: r.description,
        stars: r.stargazers_count,
      }));
    },
  },

  get_pull_requests: {
    description: 'List open pull requests for a repository',
    inputSchema: z.object({
      owner: z.string(),
      repo: z.string(),
      state: z.enum(['open', 'closed', 'all']).default('open'),
    }),
    handler: async (input: { owner: string; repo: string; state: string }) => {
      const prs = await client.get<
        Array<{ number: number; title: string; user: { login: string }; state: string }>
      >(`/repos/${input.owner}/${input.repo}/pulls?state=${input.state}`);
      return prs.map((pr) => ({
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        state: pr.state,
      }));
    },
  },

  create_issue: {
    description: 'Create a new issue in a repository',
    inputSchema: z.object({
      owner: z.string(),
      repo: z.string(),
      title: z.string(),
      body: z.string().optional(),
      labels: z.array(z.string()).optional(),
    }),
    handler: async (input: {
      owner: string;
      repo: string;
      title: string;
      body?: string;
      labels?: string[];
    }) => {
      return client.post(`/repos/${input.owner}/${input.repo}/issues`, {
        title: input.title,
        body: input.body,
        labels: input.labels,
      });
    },
  },

  get_workflow_runs: {
    description: 'Get recent CI/CD workflow runs for a repository',
    inputSchema: z.object({
      owner: z.string(),
      repo: z.string(),
      per_page: z.number().default(10),
    }),
    handler: async (input: { owner: string; repo: string; per_page: number }) => {
      const data = await client.get<{
        workflow_runs: Array<{
          id: number;
          name: string;
          status: string;
          conclusion: string;
          created_at: string;
        }>;
      }>(`/repos/${input.owner}/${input.repo}/actions/runs?per_page=${input.per_page}`);
      return data.workflow_runs.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        conclusion: r.conclusion,
        created: r.created_at,
      }));
    },
  },
};
