import { defaultsDeep } from 'lodash';
import { Context, GlobalConfig } from 'semantic-release';
import { PartialDeep } from 'type-fest';

export const createContext = function createContext(
  parts?: PartialDeep<Context & GlobalConfig>,
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result: Context = defaultsDeep(
    {},
    parts,
    {
      logger: {
        log: console.log,
        error: console.error,
      },
    },
    {
      stdout: process.stdout,
    },
    {
      commits: [
        {
          commit: {
            long: 'c3509be8bb59e6b1a7284aeb06e645b739ecfe63',
            short: 'c3509be',
          },
          tree: {
            long: '29733f75f910a56ea5792b30825898e74b9ea3bd',
            short: '29733f7',
          },
          author: {
            name: 'Ivan',
            email: 'ivan@mail.com',
            date: '2022-07-09T15:23:28.000Z',
          },
          committer: {
            name: 'Ivan',
            email: 'ivan@mail.com',
            date: '2022-07-09T15:23:28.000Z',
          },
          subject: 'chore: Fix shit',
          body: '',
          hash: 'c3509be8bb59e6b1a7284aeb06e645b739ecfe63',
          committerDate: '2022-07-09T15:23:28.000Z',
          message: 'chore: Fix shit',
          gitTags: '(HEAD -> master)',
        },
      ],
      lastRelease: {
        version: '1.0.0',
        gitTag: 'semantic-release-workspace-dependency-v1.0.0',
        channels: [undefined],
        gitHead: '4a6f439c9143cc864f493cc297f5a3c556feaf0f',
        name: 'semantic-release-workspace-dependency-v1.0.0',
      },
      releases: [],
      branch: {
        tags: [
          // { gitTag: '@acme/bar-v1.1.0', version: '1.1.0', channels: [null] },
        ],
        type: 'release',
        name: 'master',
        range: '>=1.1.0',
        accept: ['patch', 'minor', 'major'],
        main: true,
      },
      branches: [
        {
          tags: [
            // { gitTag: '@acme/bar-v1.1.0', version: '1.1.0', channels: [null] },
          ],
          type: 'release',
          name: 'master',
          range: '>=1.1.0',
          accept: ['patch', 'minor', 'major'],
          main: true,
        },
      ],
      cwd: '.',
      env: {
        COLOR: '1',
      },
      envCi: {
        isCi: false,
        commit: 'a02122edde07806333fcb338a013e841c16426ea',
        branch: 'master',
      },
      options: {
        branches: [
          '+([0-9])?(.{+([0-9]),x}).x',
          'master',
          'next',
          'next-major',
          { name: 'beta', prerelease: true },
          { name: 'alpha', prerelease: true },
        ],
        repositoryUrl: '.',
        tagFormat: '@acme/bar-v${version}',
        plugins: [
          ['@semantic-release/npm', { pkgRoot: './dist' }],
          '@semantic-release/git',
          ['semantic-release-workspace-dependency', {}],
        ],
        _: [],
        originalRepositoryURL: '.',
        dryRun: true,
      },
    },
  );

  return result;
};
