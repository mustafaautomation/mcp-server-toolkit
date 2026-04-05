import { describe, it, expect } from 'vitest';
import { slackTools } from '../../src/servers/slack/tools';

describe('slackTools', () => {
  it('should define send_message tool', () => {
    const tool = slackTools.send_message;
    expect(tool.description).toContain('message');

    const result = tool.inputSchema.safeParse({
      channel: '#engineering',
      text: 'CI pipeline failed for main branch',
    });
    expect(result.success).toBe(true);
  });

  it('should accept optional thread_ts for replies', () => {
    const result = slackTools.send_message.inputSchema.safeParse({
      channel: 'C01234',
      text: 'Reply in thread',
      thread_ts: '1234567890.123456',
    });
    expect(result.success).toBe(true);
  });

  it('should define list_channels tool', () => {
    const tool = slackTools.list_channels;
    expect(tool.description).toContain('channels');

    const result = tool.inputSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(100);
      expect(result.data.types).toBe('public_channel');
    }
  });

  it('should define search_messages tool', () => {
    const tool = slackTools.search_messages;
    expect(tool.description).toContain('Search');

    const result = tool.inputSchema.safeParse({
      query: 'deploy failure',
      count: 5,
    });
    expect(result.success).toBe(true);
  });

  it('should reject send_message without required channel', () => {
    const result = slackTools.send_message.inputSchema.safeParse({
      text: 'No channel specified',
    });
    expect(result.success).toBe(false);
  });

  it('should have all 3 tools defined', () => {
    const toolNames = Object.keys(slackTools);
    expect(toolNames).toHaveLength(3);
    expect(toolNames).toContain('send_message');
    expect(toolNames).toContain('list_channels');
    expect(toolNames).toContain('search_messages');
  });
});
