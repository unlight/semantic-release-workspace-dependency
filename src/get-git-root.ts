import { gitRoot } from '@antongolub/git-root';

import { createError } from './create-error';

export async function getGitRoot(cwd?: string): Promise<string> {
  const result = await gitRoot(cwd)
    .catch((error: unknown) => {
      throw createError('ENOGITROOT', { cwd, error });
    })
    .then(r => r?.toString());

  if (!result) {
    throw createError('ENOGITROOT', { cwd, error: 'Failed to get root' });
  }

  return result;
}
