import { execSync } from 'node:child_process';

/**
 * Get max satisfying version from git tags
 */
export function getTags(args: { name: string }) {
  const { name } = args;

  let command = `git rev-list --max-count=-1 --tags="${name}-v[0-9]*\\.[0-9]*\\.*"`;
  const commits = execSync(command, { encoding: 'utf8' });
  const pointsAt = commits
    .trim()
    .split('\n')
    .map(commit => `--points-at ${commit}`)
    .join(' ');

  command = `git tag ${pointsAt}`;

  const result = execSync(command, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(tag => tag.startsWith(name))
    .join(' ');

  return result;
}
