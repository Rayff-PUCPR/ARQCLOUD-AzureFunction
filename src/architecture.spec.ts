import { describe, expect, it } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

describe('architecture', () => {
  it('keeps calculation separated into domain, application and API layers', () => {
    expect(statSync(join('src', 'domain')).isDirectory()).toBe(true);
    expect(statSync(join('src', 'application')).isDirectory()).toBe(true);
    expect(statSync(join('src', 'functions')).isDirectory()).toBe(true);
  });

  it('keeps domain free from HTTP and Azure Functions dependencies', () => {
    const source = readFileSync(join('src', 'domain', 'calculate-route.ts'), 'utf8');
    expect(source).not.toMatch(/@azure\/functions|express|HttpRequest|HttpResponse/);
  });

  it('keeps the application layer free from HTTP framework dependencies', () => {
    const source = readFileSync(join('src', 'application', 'calculate-route.use-case.ts'), 'utf8');

    expect(source).not.toMatch(/@azure\/functions|express|HttpRequest|HttpResponse/);
  });
});
