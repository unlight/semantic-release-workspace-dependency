import SemanticReleaseError from '@semantic-release/error';
import AggregateError from 'aggregate-error';
import { Options, PluginSpec } from 'semantic-release';

import { createError } from './create-error';
import { PluginConfig } from './types';

export function verifyConfig({
  plugins,
  pluginConfig,
}: {
  plugins: NonNullable<Options['plugins']>;
  pluginConfig: PluginConfig;
}) {
  const errors: SemanticReleaseError[] = [];

  const normalizedPlugins = plugins.map(element => toPlugin(element));
  const npmIndex = normalizedPlugins.findIndex(
    plugin => plugin[0] === '@semantic-release/npm',
  );
  const gitIndex = normalizedPlugins.findIndex(
    plugin => plugin[0] === '@semantic-release/git',
  );
  const pluginIndex = normalizedPlugins.findIndex(
    plugin => plugin[0] === 'semantic-release-workspace-dependency',
  );

  if (npmIndex === -1) {
    errors.push(createError('ENOPLUGIN', { path: '@semantic-release/npm' }));
  }

  if (gitIndex === -1) {
    errors.push(createError('ENOPLUGIN', { path: '@semantic-release/git' }));
  }

  if (!(pluginIndex > npmIndex && pluginIndex > gitIndex)) {
    errors.push(
      createError('EPLUGINPLACE', {
        path: 'semantic-release-workspace-dependency',
      }),
    );
  }

  if (
    typeof pluginConfig.prefix !== 'undefined' &&
    !(
      typeof pluginConfig.prefix === 'string' &&
      ['^', '~', ''].includes(pluginConfig.prefix)
    )
  ) {
    errors.push(
      createError('EINVALIDCONFIG', {
        name: 'prefix',
        value: pluginConfig.prefix,
      }),
    );
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }
}

function toPlugin(
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  plugin: PluginSpec[] | string | [string, any] | Function,
): PluginSpec[] {
  if (Array.isArray(plugin)) {
    return plugin;
  }
  if (typeof plugin === 'string') {
    return [plugin];
  }

  if (plugin.name) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return [plugin.name, <any>plugin];
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`Cannot convert ${plugin} to pluginspec`);
}
