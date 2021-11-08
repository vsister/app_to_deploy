export function isDbSchemaError(err: { name: string }): boolean {
  return err.name === 'MissingSchemaError';
}
