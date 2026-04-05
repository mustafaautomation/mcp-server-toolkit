# Real-World Use Cases

## 1. Developer Productivity — "Ask Claude about your Jira board"

With the Jira MCP server connected to Claude Code:

```
You: "What's in the current sprint for the QA team?"
Claude: [calls search_issues with JQL: "sprint in openSprints() AND project = QA"]
→ Returns 12 tickets with status and assignees
```

## 2. Incident Response — "Create a Jira ticket and notify Slack"

```
You: "The login API is returning 500 errors. Create a P1 bug and alert #incidents"
Claude:
  1. [calls jira.create_issue: project=PLATFORM, priority=Highest, type=Bug]
  2. [calls slack.send_message: channel=#incidents, text="P1 Bug created: PLATFORM-456"]
→ Bug created + team notified in seconds
```

## 3. Database Exploration — "What tables have user data?"

```
You: "Show me all tables with 'user' in the name and their columns"
Claude: [calls postgres.list_tables → postgres.describe_table for each match]
→ Returns schema for users, user_sessions, user_preferences
```

## 4. CI Monitoring — "Are all our repos green?"

```
You: "Check CI status on our last 5 repos"
Claude: [calls github.get_workflow_runs for each repo]
→ Shows pass/fail status with links to failed runs
```

## 5. Full Claude Code Setup

Add all 4 servers to your settings:

```json
{
  "mcpServers": {
    "github": { "command": "npx", "args": ["ts-node", "src/servers/github/index.ts"] },
    "jira": { "command": "npx", "args": ["ts-node", "src/servers/jira/index.ts"] },
    "postgres": { "command": "npx", "args": ["ts-node", "src/servers/postgres/index.ts"] },
    "slack": { "command": "npx", "args": ["ts-node", "src/servers/slack/index.ts"] }
  }
}
```

Now Claude can read your tickets, check CI, query your DB, and send Slack messages — all from one conversation.
