import { z } from 'zod';
import { ApiClient } from '../../shared/api-client';

function createSlackClient() {
  return new ApiClient({
    baseUrl: 'https://slack.com/api',
    token: process.env.SLACK_BOT_TOKEN || '',
  });
}

export const slackTools = {
  send_message: {
    description: 'Send a message to a Slack channel',
    inputSchema: z.object({
      channel: z.string().describe('Channel name or ID (e.g., #engineering or C01234)'),
      text: z.string().describe('Message text (supports Slack markdown)'),
      thread_ts: z.string().optional().describe('Thread timestamp for replies'),
    }),
    handler: async (input: { channel: string; text: string; thread_ts?: string }) => {
      const client = createSlackClient();
      return client.post('/chat.postMessage', {
        channel: input.channel,
        text: input.text,
        thread_ts: input.thread_ts,
      });
    },
  },

  list_channels: {
    description: 'List Slack channels the bot has access to',
    inputSchema: z.object({
      limit: z.number().default(100),
      types: z.string().default('public_channel'),
    }),
    handler: async (input: { limit: number; types: string }) => {
      const client = createSlackClient();
      const data = await client.get<{
        channels: Array<{ id: string; name: string; num_members: number }>;
      }>(`/conversations.list?limit=${input.limit}&types=${input.types}`);
      return data.channels.map((c) => ({
        id: c.id,
        name: c.name,
        members: c.num_members,
      }));
    },
  },

  search_messages: {
    description: 'Search for messages across Slack',
    inputSchema: z.object({
      query: z.string(),
      count: z.number().default(20),
    }),
    handler: async (input: { query: string; count: number }) => {
      const client = createSlackClient();
      return client.get(
        `/search.messages?query=${encodeURIComponent(input.query)}&count=${input.count}`,
      );
    },
  },
};
