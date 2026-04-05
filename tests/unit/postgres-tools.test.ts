import { describe, it, expect } from 'vitest';
import { postgresTools } from '../../src/servers/postgres/tools';

describe('PostgreSQL Tools', () => {
  it('should reject non-SELECT queries', async () => {
    await expect(postgresTools.query.handler({ sql: 'DELETE FROM users' })).rejects.toThrow(
      'Only SELECT',
    );
  });

  it('should reject INSERT queries', async () => {
    await expect(
      postgresTools.query.handler({ sql: 'INSERT INTO users VALUES (1)' }),
    ).rejects.toThrow('Only SELECT');
  });

  it('should accept SELECT queries', async () => {
    const result = await postgresTools.query.handler({ sql: 'SELECT * FROM users' });
    expect(result.sql).toBe('SELECT * FROM users');
  });

  it('should accept WITH (CTE) queries', async () => {
    const result = await postgresTools.query.handler({
      sql: 'WITH cte AS (SELECT 1) SELECT * FROM cte',
    });
    expect(result.sql).toContain('WITH');
  });

  it('should accept EXPLAIN queries', async () => {
    const result = await postgresTools.query.handler({ sql: 'EXPLAIN SELECT 1' });
    expect(result.sql).toContain('EXPLAIN');
  });

  it('should generate list_tables query', async () => {
    const result = await postgresTools.list_tables.handler({ schema: 'public' });
    expect(result.query).toContain('information_schema.tables');
  });

  it('should generate describe_table query', async () => {
    const result = await postgresTools.describe_table.handler({ table: 'users', schema: 'public' });
    expect(result.query).toContain('information_schema.columns');
    expect(result.query).toContain('users');
  });
});
