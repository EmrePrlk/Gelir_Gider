import { Stack } from '@mui/material';

import IdeaBreadcrumbs from 'src/app/(app)/dashboard/ideas/_components/idea-breadcrumbs';

export default function IdeaDetailHeader({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: { xs: 'flex-start', sm: 'space-between' },
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
      flexWrap="wrap"
    >
      <IdeaBreadcrumbs title={title} />
      {children}
    </Stack>
  );
}
