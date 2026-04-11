'use client';

import { paths } from 'src/config/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

interface ProjectBreadcrumbsProps {
  title?: string;
}

export default function ProjectBreadcrumbs({ title }: ProjectBreadcrumbsProps) {
  return (
    <CustomBreadcrumbs
      heading="Projects"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        {
          name: 'Projects',
          href: paths.dashboard.projects.root,
        },
        ...(title ? [{ name: title }] : []),
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    />
  );
}
