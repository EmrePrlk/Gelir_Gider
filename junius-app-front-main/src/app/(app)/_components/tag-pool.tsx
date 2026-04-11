'use client';

import { Stack, Paper, useTheme, Typography } from '@mui/material';

type TagProps = {
  label: string;
};

function Tag({ label }: TagProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        backgroundColor: theme.palette.background.neutral,
        px: 1,
        py: 0.5,
      }}
    >
      <Typography variant="caption">{label}</Typography>
    </Paper>
  );
}

export default function TagPool({ items }: { items: string[] }) {
  return (
    <Stack spacing={1} direction="row" flexWrap="wrap">
      {items.map((item, index) => (
        <Tag key={`${item}-${index}`} label={item} />
      ))}
    </Stack>
  );
}
