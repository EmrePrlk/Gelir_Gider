import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useOffSetTop } from 'src/hooks/use-off-set-top';

import { bgBlur } from 'src/theme/css';
import { HEADER } from 'src/config/config-layout';
import HeaderShadow from 'src/layouts/common/header-shadow';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function HeaderSimple(props: { children?: React.ReactNode }) {
  const theme = useTheme();

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  return (
    <AppBar>
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Logo />
        {props.children}
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  );
}
