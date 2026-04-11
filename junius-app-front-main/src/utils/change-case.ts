export function paramCase(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\da-z-]/g, '');
}

export function snakeCase(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\d_a-z]/g, '');
}
