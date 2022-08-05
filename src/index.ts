import findVersions from 'find-versions';
import assert from 'node:assert';
import { writeFile } from 'node:fs/promises';
import SemanticRelease from 'semantic-release';
import semverMaxSatisfying from 'semver/ranges/max-satisfying';

import { getCwdDistPackage } from './get-cwd-dist-package';
import { getCwdPackage } from './get-cwd-package';
import { getGitRoot } from './get-git-root';
import { getMapWorkspaces } from './get-map-workspaces';
import { getTags } from './get-tags';
import { PluginConfig } from './types';
import { verifyConfig } from './verify-config';

type Context = SemanticRelease.Context &
  SemanticRelease.Config &
  SemanticRelease.Options;

export const name = 'semantic-release-workspace-dependency';

export async function verifyConditions(
  pluginConfig: PluginConfig,
  context: Context,
) {
  const { cwd, options, logger } = context;
  const plugins = options?.plugins;

  assert.ok(cwd);
  assert.ok(plugins);

  verifyConfig({ plugins, pluginConfig });
  await getCwdDistPackage({ cwd, plugins });

  const root = await getGitRoot(cwd);
  const workspaces = await getMapWorkspaces({ root });
  const cwdPackage = await getCwdPackage({ cwd });

  if (!cwdPackage.dependencies) {
    return;
  }

  const dependencies = cwdPackage.dependencies as Record<string, string>;

  for (const [packageName, version] of Object.entries(dependencies)) {
    const dependencyWorkspaceFolder = workspaces.get(packageName);
    if (!dependencyWorkspaceFolder) {
      continue;
    }
    logger.log('Found workspace dependency %s', `${packageName}@${version}`);
  }
}

export async function prepare(pluginConfig: PluginConfig, context: Context) {
  const { cwd, options, env } = context;
  const plugins = options?.plugins;

  assert.ok(cwd);

  const prefix = pluginConfig.prefix ?? '^';
  const root = env.GIT_ROOT || (await getGitRoot(cwd));
  const workspaces = await getMapWorkspaces({ root });
  const { json: cwdDistPackage, path: cwdDistPackagePath } =
    await getCwdDistPackage({
      cwd,
      plugins,
    });

  if (!cwdDistPackage.dependencies) {
    return;
  }

  const dependencies = cwdDistPackage.dependencies as Record<string, string>;

  for (const [packageName, version] of Object.entries<string>(dependencies)) {
    const dependencyWorkspaceFolder = workspaces.get(packageName);

    if (!dependencyWorkspaceFolder) {
      continue;
    }

    const tags = getTags({ name: packageName });
    const versions = findVersions(tags, { loose: true });
    const dependencyVersion = semverMaxSatisfying(versions, version);

    if (!dependencyVersion) {
      continue;
    }

    cwdDistPackage.dependencies[packageName] = `${prefix}${dependencyVersion}`;
  }

  await writeFile(
    cwdDistPackagePath,
    JSON.stringify(cwdDistPackage, undefined, 2),
  );
}
