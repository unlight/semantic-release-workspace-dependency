import assert from 'node:assert';
import path from 'node:path';
import readPackage from 'read-package-json-fast';
import SemanticRelease from 'semantic-release';
import { JsonObject } from 'type-fest';

import { createError } from './create-error';

export async function getCwdDistPackage({
  cwd,
  plugins,
}: {
  cwd: string;
  plugins: SemanticRelease.Options['plugins'];
}) {
  assert.ok(plugins);

  // Find @semantic-release/npm option pkgRoot
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const cwdPackageRoot: string =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    plugins.find(plugin => plugin[0] === '@semantic-release/npm')?.at(1)
      ?.pkgRoot || '.';

  const cwdDistributionPackagePath = path.resolve(
    cwd,
    cwdPackageRoot,
    'package.json',
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const result: JsonObject = await readPackage(
    cwdDistributionPackagePath,
  ).catch((error: unknown) => {
    throw createError('EREADPACKAGE', {
      path: cwdDistributionPackagePath,
      error,
    });
  });

  return { json: result, path: cwdDistributionPackagePath };
}
