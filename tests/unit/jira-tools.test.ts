import { describe, it, expect } from 'vitest';
import { jiraTools } from '../../src/servers/jira/tools';

describe('jiraTools', () => {
  it('should define search_issues tool with JQL support', () => {
    const tool = jiraTools.search_issues;
    expect(tool.description).toContain('JQL');

    const result = tool.inputSchema.safeParse({
      jql: 'project = QA AND status = Open',
      maxResults: 10,
    });
    expect(result.success).toBe(true);
  });

  it('should use default maxResults when not provided', () => {
    const result = jiraTools.search_issues.inputSchema.safeParse({
      jql: 'project = QA',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maxResults).toBe(20);
    }
  });

  it('should define create_issue tool with all fields', () => {
    const tool = jiraTools.create_issue;
    expect(tool.description).toContain('issue');

    const result = tool.inputSchema.safeParse({
      project: 'QA',
      summary: 'Login test failing on staging',
      description: 'The login test fails intermittently',
      issueType: 'Bug',
      priority: 'High',
    });
    expect(result.success).toBe(true);
  });

  it('should validate issue type enum', () => {
    const invalid = jiraTools.create_issue.inputSchema.safeParse({
      project: 'QA',
      summary: 'Test',
      issueType: 'Epic', // not in enum
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate priority enum', () => {
    const invalid = jiraTools.create_issue.inputSchema.safeParse({
      project: 'QA',
      summary: 'Test',
      priority: 'URGENT', // not in enum
    });
    expect(invalid.success).toBe(false);
  });

  it('should define transition_issue tool', () => {
    const tool = jiraTools.transition_issue;
    expect(tool.description).toContain('Transition');

    const result = tool.inputSchema.safeParse({
      issueKey: 'QA-123',
      transitionName: 'Done',
    });
    expect(result.success).toBe(true);
  });

  it('should have all 3 tools defined', () => {
    const toolNames = Object.keys(jiraTools);
    expect(toolNames).toHaveLength(3);
    expect(toolNames).toContain('search_issues');
    expect(toolNames).toContain('create_issue');
    expect(toolNames).toContain('transition_issue');
  });
});
