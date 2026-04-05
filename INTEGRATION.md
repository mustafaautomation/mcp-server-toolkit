# Integration Guide — MCP Servers + AI Agents

## Complete AI-Powered Dev Workflow

```
Developer asks Claude a question
    ↓
Claude Code + MCP Servers  ← YOU ARE HERE
    ↓
┌─────────┬──────────┬──────────┬──────────┐
│ GitHub  │  Jira    │  Slack   │ Postgres │
│ Server  │  Server  │  Server  │  Server  │
└─────────┴──────────┴──────────┴──────────┘
    ↓
Real actions: create issues, post messages, query data
```

## Setup All 4 Servers in Claude Code

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["ts-node", "/path/to/mcp-server-toolkit/src/servers/github/index.ts"],
      "env": { "GITHUB_TOKEN": "ghp_your_token" }
    },
    "jira": {
      "command": "npx",
      "args": ["ts-node", "/path/to/mcp-server-toolkit/src/servers/jira/index.ts"],
      "env": {
        "JIRA_HOST": "your-domain.atlassian.net",
        "JIRA_EMAIL": "your@email.com",
        "JIRA_API_TOKEN": "your_token"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["ts-node", "/path/to/mcp-server-toolkit/src/servers/slack/index.ts"],
      "env": { "SLACK_BOT_TOKEN": "xoxb-your-token" }
    },
    "postgres": {
      "command": "npx",
      "args": ["ts-node", "/path/to/mcp-server-toolkit/src/servers/postgres/index.ts"],
      "env": { "DATABASE_URL": "postgresql://user:pass@localhost:5432/db" }
    }
  }
}
```

## Use with Claude Code Skills

Combine with [claude-code-skills](https://github.com/mustafaautomation/claude-code-skills):

```
/pr-reviewer  → Uses GitHub MCP to fetch PR diffs
/db-query     → Uses PostgreSQL MCP to run queries
```

## Use with n8n Workflows

The MCP servers complement [n8n-enterprise-workflows](https://github.com/mustafaautomation/n8n-enterprise-workflows):

- MCP = AI agent real-time actions (Claude uses tools)
- n8n = Automated event-driven workflows (webhooks trigger actions)

Both can create Jira tickets, send Slack messages, check GitHub status.

## Related Tools

| Tool | Integration |
|------|-------------|
| [claude-code-skills](https://github.com/mustafaautomation/claude-code-skills) | Skills that use MCP servers |
| [ai-code-reviewer](https://github.com/mustafaautomation/ai-code-reviewer) | Reviews PRs using GitHub API |
| [n8n-enterprise-workflows](https://github.com/mustafaautomation/n8n-enterprise-workflows) | Event-driven automation |
| [ai-test-orchestrator](https://github.com/mustafaautomation/ai-test-orchestrator) | AI testing pipeline |
