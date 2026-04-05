import { describe, it, expect } from 'vitest';
import { githubTools } from '../../src/servers/github/tools';

describe('githubTools', () => {
  it('should define list_repos tool with correct schema', () => {
    const tool = githubTools.list_repos;
    expect(tool.description).toContain('repositories');
    expect(tool.handler).toBeDefined();

    // Validate schema accepts valid input
    const result = tool.inputSchema.safeParse({
      owner: 'mustafaautomation',
      type: 'public',
      per_page: 10,
    });
    expect(result.success).toBe(true);
  });

  it('should reject invalid list_repos input', () => {
    const result = githubTools.list_repos.inputSchema.safeParse({
      owner: 'test',
      type: 'invalid-type',
    });
    expect(result.success).toBe(false);
  });

  it('should define get_pull_requests tool', () => {
    const tool = githubTools.get_pull_requests;
    expect(tool.description).toContain('pull requests');

    const result = tool.inputSchema.safeParse({
      owner: 'mustafaautomation',
      repo: 'playwright-enterprise-framework',
      state: 'open',
    });
    expect(result.success).toBe(true);
  });

  it('should define create_issue tool with optional fields', () => {
    const tool = githubTools.create_issue;
    expect(tool.description).toContain('issue');

    // Minimal input (no optional fields)
    const minimal = tool.inputSchema.safeParse({
      owner: 'test',
      repo: 'test-repo',
      title: 'Bug report',
    });
    expect(minimal.success).toBe(true);

    // Full input with optional fields
    const full = tool.inputSchema.safeParse({
      owner: 'test',
      repo: 'test-repo',
      title: 'Bug report',
      body: 'Detailed description',
      labels: ['bug', 'critical'],
    });
    expect(full.success).toBe(true);
  });

  it('should define get_workflow_runs tool', () => {
    const tool = githubTools.get_workflow_runs;
    expect(tool.description).toContain('workflow');

    const result = tool.inputSchema.safeParse({
      owner: 'mustafaautomation',
      repo: 'ai-test-orchestrator',
    });
    expect(result.success).toBe(true);
  });

  it('should have all 4 tools defined', () => {
    const toolNames = Object.keys(githubTools);
    expect(toolNames).toHaveLength(4);
    expect(toolNames).toContain('list_repos');
    expect(toolNames).toContain('get_pull_requests');
    expect(toolNames).toContain('create_issue');
    expect(toolNames).toContain('get_workflow_runs');
  });
});
