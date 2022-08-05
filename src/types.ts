export type PluginConfig = Partial<{
  prefix: '' | '^' | '~';
}>;

export interface PackageJsonB {
  name: string;
  dependencies: DependenciesB;
}

export interface DependenciesB {
  a: string;
  unknown: string;
}
