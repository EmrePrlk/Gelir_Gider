'use client';

import { Stack, ListItemText } from '@mui/material';

interface IdeaFormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function IdeaFormSection({
  title,
  description,
  children,
}: IdeaFormSectionProps) {
  return (
    <Stack spacing={1}>
      <ListItemText
        primary={title}
        primaryTypographyProps={{
          variant: 'h6',
        }}
        secondary={`• ${description}`}
      />
      {children}
    </Stack>
  );
}
