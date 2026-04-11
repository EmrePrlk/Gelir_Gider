import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

type ReturnType = boolean;

export function useActiveLink(path: string, deep = true): ReturnType {
  const pathname = usePathname();

  const checkPath = path.startsWith('#');

  // Remove trailing slash from both the current path and the pathname
  const currentPath = path.replace(/\/$/, '');
  const normalizedPathname = pathname?.replace(/\/$/, '');

  const normalActive = !checkPath && normalizedPathname === currentPath;

  const deepActive = !checkPath && normalizedPathname?.startsWith(currentPath);

  return deep ? (deepActive ?? false) : (normalActive ?? false);
}
