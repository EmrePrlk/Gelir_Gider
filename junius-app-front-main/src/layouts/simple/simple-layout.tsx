'use client';

import { Box, Stack } from '@mui/material';

import Header from 'src/layouts/compact/header-simple';
import AccountPopover from 'src/layouts/common/account-popover';

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1 }}
        >
          <AccountPopover />
        </Stack>
      </Header>
      <Box>
        <Box
          paddingBottom={{ xs: 8, md: 14 }}
          paddingTop={9}
          minHeight="100vh"
          sx={{
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: "url('/assets/background/overlay_4.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'rgba(0, 0, 0, 0.24)',
              opacity: 0.24,
              zIndex: -1,
            }}
          />

          {children}
        </Box>
      </Box>
    </>
  );
}
