import Iconify from 'src/components/iconify';

export const icon = (name: string, color?: string, width?: number) => (
  <Iconify icon={name} width={width || 24} color={color || 'currentcolor'} />
);
