import mapWorkspaces from '@npmcli/map-workspaces';
import path from 'node:path';
import readPackage from 'read-package-json-fast';
import { JsonObject } from 'type-fest';

import { createError } from './create-error';

export async function getMapWorkspaces(args: { root: string }) {
  const { root } = args;

  const rootPackagePath = path.join(root, 'package.json');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const rootPackage: JsonObject = await readPackage(rootPackagePath).catch(
    (error: unknown) => {
      throw createError('EREADPACKAGE', { path: rootPackagePath, error });
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const result: Map<string, string> = await mapWorkspaces({
    cwd: root,
    pkg: {
      workspaces: rootPackage.workspaces,
    },
  });

  return result;
}
