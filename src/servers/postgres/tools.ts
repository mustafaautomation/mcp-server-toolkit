import { z } from 'zod';

// Note: In production, use pg (node-postgres). Here we define the tool interface
// and handler signatures. The actual DB connection requires pg as a dependency.

export const postgresTools = {
  query: {
    description: 'Execute a read-only SQL query against PostgreSQL',
    inputSchema: z.object({
      sql: z.string().describe('SQL SELECT query to execute'),
      params: z
        .array(z.unknown())
        .optional()
        .describe('Query parameters for parameterized queries'),
    }),
    handler: async (input: { sql: string; params?: unknown[] }) => {
      // Validate read-only
      const normalized = input.sql.trim().toUpperCase();
      if (
        !normalized.startsWith('SELECT') &&
        !normalized.startsWith('WITH') &&
        !normalized.startsWith('EXPLAIN')
      ) {
        throw new Error('Only SELECT, WITH, and EXPLAIN queries are allowed');
      }

      // In production: const result = await pool.query(input.sql, input.params);
      return {
        note: 'PostgreSQL connection requires pg dependency. Install pg and configure DATABASE_URL.',
        sql: input.sql,
        params: input.params || [],
      };
    },
  },

  list_tables: {
    description: 'List all tables in the current database schema',
    inputSchema: z.object({
      schema: z.string().default('public'),
    }),
    handler: async (input: { schema: string }) => {
      return {
        note: 'Requires pg connection',
        query: `SELECT table_name FROM information_schema.tables WHERE table_schema = '${input.schema}' ORDER BY table_name`,
      };
    },
  },

  describe_table: {
    description: 'Get column definitions for a table',
    inputSchema: z.object({
      table: z.string(),
      schema: z.string().default('public'),
    }),
    handler: async (input: { table: string; schema: string }) => {
      return {
        note: 'Requires pg connection',
        query: `SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = '${input.schema}' AND table_name = '${input.table}' ORDER BY ordinal_position`,
      };
    },
  },
};
