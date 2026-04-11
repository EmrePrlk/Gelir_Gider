'use client';

import Link from 'next/link';

import { Card, Button, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';

import type { IRoleGroup } from 'src/types/role-group';

interface CardProps {
  card: IRoleGroup;
}

function LoginRoleCard({ card }: Readonly<CardProps>) {
  const IconComponent = card.icon;
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingX: 3,
        paddingY: { xs: 3, sm: 3, md: 5 },
        backgroundColor: 'white',
        borderRadius: '1rem',
        width: { xs: '18rem', md: '25rem' },
        height: { xs: '24rem', md: '28rem' },
        gap: 3,
      }}
    >
      {IconComponent && (
        <IconComponent
          sx={{
            width: '100%',
            height: '117px',
          }}
        />
      )}

      <Typography variant="h4" sx={{ textAlign: 'center' }}>
        {card.name}
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center' }}>
        {card.description}
      </Typography>

      <Button
        component={Link}
        href={card.link}
        variant="contained"
        color="inherit"
        fullWidth
        size="large"
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={24} />}
      >
        Continue as {card.name}
      </Button>
    </Card>
  );
}

export default LoginRoleCard;
