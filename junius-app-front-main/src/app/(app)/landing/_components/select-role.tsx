'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { useDefinitionStore } from 'src/stores/definition-store';

import LoginRoleCard from './login-role-card';

function SelectRoleView() {
  const [roleGroups] = useDefinitionStore(state => [state.roleGroups]);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingX: { xs: 3, sm: 5, lg: 7 },
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          padding: { xs: 0, md: 3 },
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          Welcome to Junius App!
        </Typography>
        <Typography variant="body1">
          Let us know who you are to get started.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          // flexWrap: 'wrap',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 4,
          // width: '100%',
          marginBottom: 16,
        }}
      >
        {Object.values(roleGroups).map(
          card =>
            !card.isHidden && <LoginRoleCard key={card.name} card={card} />,
        )}
      </Box>
    </Box>
  );
}

export default SelectRoleView;
