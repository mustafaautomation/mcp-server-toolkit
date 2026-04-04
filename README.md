# MCP Server Toolkit

[![CI](https://github.com/mustafaautomation/mcp-server-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/mustafaautomation/mcp-server-toolkit/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-FF6B35.svg)](https://modelcontextprotocol.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

Collection of **Model Context Protocol (MCP)** servers for enterprise AI integrations. Connect Claude, ChatGPT, or any MCP-compatible AI agent to GitHub, Jira, PostgreSQL, and Slack.

---

## What is MCP?

**Model Context Protocol** is an open standard that allows AI assistants to interact with external tools and data sources. These MCP servers give AI agents the ability to:

- Read and create GitHub issues, PRs, and workflow runs
- Search and manage Jira tickets
- Query PostgreSQL databases (read-only)
- Send Slack messages and search conversations

---

## Servers

| Server | Tools | Use Cases |
|--------|-------|-----------|
| **GitHub** | list_repos, get_pull_requests, create_issue, get_workflow_runs | PR review, CI monitoring, issue triage |
| **Jira** | search_issues, create_issue, transition_issue | Sprint management, bug tracking, automation |
| **PostgreSQL** | query, list_tables, describe_table | Data exploration, report generation, debugging |
| **Slack** | send_message, list_channels, search_messages | Notifications, team communication, incident response |

---

## Quick Start

```bash
git clone https://github.com/mustafaautomation/mcp-server-toolkit.git
cd mcp-server-toolkit
npm install

# Start a server
GITHUB_TOKEN=ghp_xxx npx ts-node src/servers/github/index.ts
```

### Claude Code Integration

Add to your `claude_desktop_config.json` or `.claude/settings.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["ts-node", "src/servers/github/index.ts"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token"
      }
    },
    "jira": {
      "command": "npx",
      "args": ["ts-node", "src/servers/jira/index.ts"],
      "env": {
        "JIRA_HOST": "your-domain.atlassian.net",
        "JIRA_EMAIL": "your@email.com",
        "JIRA_API_TOKEN": "your_token"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["ts-node", "src/servers/slack/index.ts"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token"
      }
    }
  }
}
```

---

## Architecture

```
┌──────────────────────────────────┐
│      AI Agent (Claude/GPT)       │
│                                  │
│   "Create a Jira ticket for     │
│    the CI failure on main"      │
└──────────┬───────────────────────┘
           │ MCP Protocol (stdio)
           ▼
┌──────────────────────────────────┐
│       MCP Server Toolkit         │
├──────────────────────────────────┤
│  GitHub   │  Jira   │  Slack    │
│  Server   │  Server │  Server   │
│           │         │           │
│  4 tools  │  3 tools│  3 tools  │
├──────────────────────────────────┤
│  PostgreSQL Server               │
│  3 tools (read-only)             │
├──────────────────────────────────┤
│        Shared Layer              │
│  ApiClient │ Types │ Validation  │
└──────────────────────────────────┘
```

---

## Security

- **PostgreSQL server is read-only** — only SELECT, WITH, and EXPLAIN queries allowed
- All API tokens are passed via environment variables, never hardcoded
- Each server runs as an independent process

---

## Project Structure

```
mcp-server-toolkit/
├── src/
│   ├── shared/
│   │   ├── types.ts               # Common types
│   │   └── api-client.ts          # Reusable HTTP client
│   └── servers/
│       ├── github/
│       │   ├── index.ts           # MCP server entrypoint
│       │   └── tools.ts           # 4 tools: repos, PRs, issues, workflows
│       ├── jira/
│       │   ├── index.ts
│       │   └── tools.ts           # 3 tools: search, create, transition
│       ├── postgres/
│       │   ├── index.ts
│       │   └── tools.ts           # 3 tools: query, list_tables, describe
│       └── slack/
│           ├── index.ts
│           └── tools.ts           # 3 tools: send, list, search
├── tests/unit/
│   ├── api-client.test.ts
│   └── postgres-tools.test.ts     # Read-only validation tests
└── .github/workflows/ci.yml
```

---

## Environment Variables

| Variable | Server | Description |
|----------|--------|-------------|
| `GITHUB_TOKEN` | GitHub | Personal access token |
| `JIRA_HOST` | Jira | Atlassian domain |
| `JIRA_EMAIL` | Jira | Account email |
| `JIRA_API_TOKEN` | Jira | API token |
| `SLACK_BOT_TOKEN` | Slack | Bot OAuth token |
| `DATABASE_URL` | PostgreSQL | Connection string |

---

## License

MIT

---

Built by [Quvantic](https://quvantic.com)
