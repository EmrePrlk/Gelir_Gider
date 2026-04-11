import { useMemo } from 'react';
import RouterLink from 'next/link';

import { Card, Stack, Button, useTheme, Typography } from '@mui/material';

import { icon } from 'src/app/(app)/_components/icon';

export default function ProjectSocial() {
  const theme = useTheme();

  const cards = useMemo(
    () => [
      {
        icon: icon('fa6-solid:globe', theme.palette.primary.main),
        alt: 'Web Site',
        label: 'Web Site',
        link: 'https://www.website.com/#',
      },
      {
        icon: icon('iconoir:agile', theme.palette.primary.main),
        alt: 'Juni Flow',
        label: 'Juni Flow',
        link: 'https://juniflow.juniusapps.com/',
      },
      {
        icon: icon('fa6-brands:discord', '#5865F2'),
        alt: 'Discord',
        label: 'Discord',
        link: 'https://discord.com/#',
      },
      {
        icon: icon('fa6-brands:github', '#181717'),
        alt: 'Github',
        label: 'Github',
        link: 'https://github.com/#',
      },
      {
        icon: icon('fa6-brands:instagram', '#E1306C'),
        alt: 'Instagram',
        label: 'Instagram',
        link: 'https://www.instagram.com/#',
      },
      {
        icon: icon('fa6-brands:linkedin', '#0077B5'),
        alt: 'LinkedIn',
        label: 'LinkedIn',
        link: 'https://www.linkedin.com/#',
      },
      {
        icon: icon('fa6-brands:square-x-twitter', '#000'),
        alt: 'X',
        label: 'X',
        link: 'https://x.com/#',
      },
      {
        icon: icon('fa6-brands:facebook', '#1877F2'),
        alt: 'Facebook',
        label: 'Facebook',
        link: 'https://www.facebook.com/#',
      },
    ],
    [theme.palette.primary.main],
  );

  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={{ xs: 2, sm: 4 }}
        sx={{
          justifyContent: 'center',
        }}
      >
        {cards.map(card => (
          <Button
            key={card.alt}
            component={RouterLink}
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              width: { xs: 'calc(25% - 8px)', sm: 'auto' },
              minWidth: '80px',
              maxWidth: '120px',
              m: 0.5,
            }}
          >
            {card.icon}
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {card.label}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Card>
  );
}
