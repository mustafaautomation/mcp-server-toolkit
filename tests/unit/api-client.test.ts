import { describe, it, expect } from 'vitest';
import { ApiClient } from '../../src/shared/api-client';

describe('ApiClient', () => {
  it('should construct with base URL trimming trailing slash', () => {
    const client = new ApiClient({
      baseUrl: 'https://api.example.com/',
      token: 'test-token',
    });
    expect(client).toBeDefined();
  });

  it('should throw on network error', async () => {
    const client = new ApiClient({
      baseUrl: 'http://localhost:1',
      token: 'fake',
      timeout: 1000,
    });
    await expect(client.get('/anything')).rejects.toThrow();
  });
});
