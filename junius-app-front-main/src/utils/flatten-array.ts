// ----------------------------------------------------------------------

export function flattenArray<T>(list: T[], key = 'children'): T[] {
  let children: T[] = [];

  const flatten = list?.map((item: T) => {
    if (Array.isArray(item[key as keyof T])) {
      children = [...children, ...(item[key as keyof T] as T[])];
    }
    return item;
  });

  return flatten?.concat(
    children.length > 0 ? flattenArray(children, key) : children,
  );
}
