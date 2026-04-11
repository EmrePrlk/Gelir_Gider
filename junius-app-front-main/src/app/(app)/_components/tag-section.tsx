import { Stack, Typography } from '@mui/material';

import TagPool from './tag-pool';

type TagSectionProps = {
  title: string;
  items: string[];
};

export default function TagSection({ title, items }: TagSectionProps) {
  return (
    <Stack key={title} spacing={1}>
      <Typography variant="subtitle1">{title}</Typography>
      <TagPool items={items} />
    </Stack>
  );
}
