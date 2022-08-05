import mockFs from 'mock-fs';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import semanticRelease from 'semantic-release';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import * as plugin from './index';
import { createContext } from './testing';
import { PackageJsonB, PluginConfig } from './types';

describe('smoke', () => {
  it('plugin defined', () => {
    assert.ok(plugin);
    assert.ok(plugin.name);
  });
});

describe('verifyConditions', () => {
  const cwd = path.dirname(path.resolve(fileURLToPath(import.meta.url), '..'));

  it('verifyConditions plugin', async () => {
    const context = createContext({
      cwd,
      options: {
        plugins: [
          ['@semantic-release/npm', { pkgRoot: '.' }],
          '@semantic-release/git',
          ['semantic-release-workspace-dependency', {}],
        ],
      },
    });

    await plugin.verifyConditions({}, context);
  });

  it('plugin should be after npm and git', async () => {
    const context = createContext({
      options: {
        plugins: [
          '@semantic-release/npm',
          'semantic-release-workspace-dependency',
          '@semantic-release/git',
        ],
      },
    });

    await assert.rejects(
      plugin.verifyConditions({}, context),
      'should be placed after npm and git',
    );
  });

  it('verify prefix configuration', async () => {
    const context = createContext({});
    const pluginConfig = { prefix: '!' } as unknown as PluginConfig;

    await assert.rejects(async () => {
      return await plugin.verifyConditions(pluginConfig, context);
    }, 'Invalid value');
  });

  const pluginConfigs: PluginConfig[] = [
    { prefix: '' },
    { prefix: '~' },
    { prefix: '^' },
    { prefix: undefined },
  ];

  for (const pluginConfig of pluginConfigs) {
    it(`verify prefix configuration ${pluginConfig.prefix!}`, async () => {
      const context = createContext({
        cwd,
        options: {
          plugins: [
            ['@semantic-release/npm', { pkgRoot: '.' }],
            '@semantic-release/git',
            <any>plugin,
          ],
        },
      });
      return await plugin.verifyConditions(pluginConfig, context);
    });
  }

  it('no plugin @semantic-release/npm', async () => {
    const context = createContext({
      options: {
        plugins: ['@semantic-release/git', <any>plugin],
      },
    });

    await assert.rejects(plugin.verifyConditions({}, context), 'ENOPLUGIN');
  });

  it('no plugin @semantic-release/git', async () => {
    const context = createContext({
      options: {
        plugins: ['@semantic-release/npm', <any>plugin],
      },
    });

    await assert.rejects(plugin.verifyConditions({}, context), 'ENOPLUGIN');
  });

  it('invalid configuration', async () => {
    const context = createContext({
      options: {
        plugins: [<any>{}],
      },
    });

    await assert.rejects(
      plugin.verifyConditions({}, context),
      'Cannot convert',
    );
  });
});

describe('prepare', () => {
  beforeAll(() => {
    const volume = {
      '/root/package.json': JSON.stringify({
        workspaces: ['packages/*'],
      }),
      '/root/packages/a/package.json': JSON.stringify({
        name: 'a',
        dependencies: {},
      }),
      '/root/packages/b/package.json': JSON.stringify({
        name: 'b',
        dependencies: { a: '*', unknown: '*' },
      }),
    };
    mockFs(volume);

    return () => {
      mockFs.restore();
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('prepare plugin', async () => {
    vi.mock('./get-satisfying-version', () => {
      return {
        getSatisfyingVersion: () => '0.0.5',
      };
    });

    const context = createContext({
      env: { GIT_ROOT: '/root' },
      cwd: '/root/packages/b',
      options: {
        plugins: [
          ['@semantic-release/npm', { pkgRoot: '.' }],
          '@semantic-release/git',
          <any>plugin,
        ],
      },
    });
    await plugin.prepare({}, context);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const b: PackageJsonB = JSON.parse(
      readFileSync('/root/packages/b/package.json').toString(),
    );

    expect(b.dependencies.a).toBe('^0.0.5');
  });

  it.todo('inject getSatisfyingVersion');
});

describe('integration', () => {
  it('dry run', async () => {
    await semanticRelease({
      dryRun: true,
      noCi: true,
      branches: ['master'],
      plugins: [
        '@semantic-release/git',
        ['@semantic-release/npm', { pkgRoot: '.' }],
        <any>plugin,
      ],
      repositoryUrl: '.',
    });
  });

  it.runIf(process.env.CI)('no ci', async () => {
    await semanticRelease({
      dryRun: false,
      noCi: true,
      branches: ['master'],
      plugins: [
        '@semantic-release/git',
        ['@semantic-release/npm', { pkgRoot: '.' }],
        <any>plugin,
      ],
      repositoryUrl: '.',
    });
  });
});
