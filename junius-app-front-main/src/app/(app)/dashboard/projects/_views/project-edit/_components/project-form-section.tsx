'use client';

import { Card, CardHeader, CardContent } from '@mui/material';

interface ProjectFormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ProjectFormSection({
  title,
  children,
}: ProjectFormSectionProps) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}
