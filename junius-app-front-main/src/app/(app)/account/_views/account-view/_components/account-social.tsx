'use client';

import RouterLink from 'next/link';

import { Card, Link, Stack, CardHeader } from '@mui/material';

import Iconify from 'src/components/iconify';

import { useManagedUser } from '../../../_context/use-managed-user';

export default function AccountSocial() {
  const { user } = useManagedUser();

  const socials = [
    {
      name: 'Facebook',
      icon: 'fa6-brands:facebook',
      value: 'facebook',
      color: '#1877F2',
      link: user?.facebook_link,
    },
    {
      name: 'Instagram',
      icon: 'fa6-brands:instagram',
      value: 'instagram',
      color: '#E1306C',
      link: user?.instagram_link,
    },
    {
      name: 'LinkedIn',
      icon: 'fa6-brands:linkedin',
      value: 'linkedin',
      color: '#0077B5',
      link: user?.linkedin_link,
    },
    {
      name: 'Twitter',
      icon: 'fa6-brands:twitter',
      value: 'twitter',
      color: '#1DA1F2',
      link: user?.twitter_link,
    },
    {
      name: 'Github',
      icon: 'fa6-brands:github',
      value: 'github',
      color: '#181717',
      link: user?.github_link,
    },
  ];

  if (socials.every(link => !link.link)) return null;

  return (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {socials.map(link =>
          link.link ? (
            <Stack
              key={link.name}
              spacing={2}
              direction="row"
              sx={{ wordBreak: 'break-all', typography: 'body2' }}
            >
              <Iconify
                icon={link.icon}
                width={24}
                sx={{
                  flexShrink: 0,
                  color: link.color,
                }}
              />
              <Link
                href={link.link ?? '#'}
                target="_blank"
                variant="body1"
                color="inherit"
                component={RouterLink}
              >
                {link.link}
              </Link>
            </Stack>
          ) : null,
        )}
      </Stack>
    </Card>
  );
}
