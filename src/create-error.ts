import SemanticReleaseError from '@semantic-release/error';
import ensureError from 'ensure-error';

type CreateErrorContext = {
  error?: Error | unknown | string;
  cwd?: string;
  path?: string;
  name?: string;
  value?: string;
};

export function createError(
  code: string,
  context: CreateErrorContext,
): SemanticReleaseError {
  let message = 'Unknown error';
  const { error, cwd, path, name, value } = context;
  switch (code) {
    case 'ENOGITROOT':
      message = `Falied to find git root from ${JSON.stringify(cwd)}`;
      break;
    case 'EREADPACKAGE':
      message = `Falied to read ${JSON.stringify(path)}`;
      break;
    case 'ENOPLUGIN':
      message = `Missing plugin ${JSON.stringify(path)}`;
      break;
    case 'EPLUGINPLACE':
      message = `Plugin ${JSON.stringify(
        path,
      )} should be placed after npm and git`;
      break;
    case 'EINVALIDCONFIG':
      message = `Invalid value for ${JSON.stringify(name)} (${JSON.stringify(
        value,
      )})`;
      break;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  return new SemanticReleaseError(message, code, ensureError(error || message));
}
