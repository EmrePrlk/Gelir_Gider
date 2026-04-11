'use client';

import { paths } from 'src/config/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

interface IdeaBreadcrumbsProps {
  title?: string;
}

export default function IdeaBreadcrumbs({ title }: IdeaBreadcrumbsProps) {
  return (
    <CustomBreadcrumbs
      heading={title}
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Ideas', href: paths.dashboard.ideas.root },
        ...(title ? [{ name: title }] : []),
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
}
