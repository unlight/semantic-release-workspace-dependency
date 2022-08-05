import path from 'node:path';
import readPackage from 'read-package-json-fast';
import { JsonObject } from 'type-fest';

import { createError } from './create-error';

export async function getCwdPackage({ cwd }: { cwd: string }) {
  const cwdPackagePath = path.join(cwd, 'package.json');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const result: JsonObject = await readPackage(cwdPackagePath).catch(
    (error: unknown) => {
      throw createError('EREADPACKAGE', { path: cwdPackagePath, error });
    },
  );

  return result;
}
