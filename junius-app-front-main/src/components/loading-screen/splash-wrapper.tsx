import { type BoxProps } from '@mui/system';

import LoadingScreen from './loading-screen';

export default function SplashWrapper({
  children,
  isLoading,
  animation = 'progress',
  ...other
}: {
  children: React.ReactNode;
  isLoading: boolean;
  animation?: 'progress' | 'animation';
} & BoxProps) {
  if (isLoading) {
    return <LoadingScreen animation={animation} {...other} />;
  }

  return <>{children}</>;
}
