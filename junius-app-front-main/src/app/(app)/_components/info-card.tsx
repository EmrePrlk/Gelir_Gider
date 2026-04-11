'use client';

import {
  Card,
  Grid,
  Stack,
  CardHeader,
  Typography,
  CardContent,
  type SxProps,
} from '@mui/material';

import { icon } from './icon';

type InfoItem = {
  icon: {
    name: string;
    color?: string;
  };
  label: string;
  value: string | null | undefined;
};

type InfoCardProps = {
  data: InfoItem[];
  title?: string;
  sx?: SxProps;
};

export default function InfoCard({ title, data, sx }: InfoCardProps) {
  const filteredData = data.filter(item => item.value);

  if (filteredData.length === 0) return null;

  return (
    <Card sx={sx}>
      {title && <CardHeader title={title} />}
      <CardContent>
        <Grid container spacing={3}>
          {filteredData.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Stack direction="row" spacing={2} alignItems="center">
                {icon(item.icon.name, item.icon.color)}
                <Stack>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
