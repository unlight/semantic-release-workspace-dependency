import findVersions from 'find-versions';
import { execSync } from 'node:child_process';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';

/**
 * Get max satisfying version from git tags
 */
export function getSatisfyingVersion(args: { name: string; range: string }) {
  const { name, range } = args;

  let command = `git rev-list --max-count=-1 --tags="${name}-v[0-9]*\\.[0-9]*\\.*"`;
  const commits = execSync(command, { encoding: 'utf8' });
  const pointsAt = commits
    .trim()
    .split('\n')
    .map(commit => `--points-at ${commit}`)
    .join(' ');

  command = `git tag ${pointsAt}`;

  const tagList = execSync(command, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(tag => tag.startsWith(name))
    .join(' ');
  const versions = findVersions(tagList, { loose: true });
  const result = semverMaxSatisfying(versions, range);

  return result;
}
