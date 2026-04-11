import { LoadingButton } from '@mui/lab';
import {
  Link,
  Stack,
  Divider,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { AlertError } from 'src/components/form-error';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useLoginForm } from '../_hooks/use-login-form';

export default function LoginForm() {
  const { methods, errorMsg, isSubmitting, password, onSubmit } =
    useLoginForm();

  return (
    <>
      <AlertError error={errorMsg} />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <RHFTextField name="email" label="Email address" />

          <RHFTextField
            name="password"
            label="Password"
            type={password.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={password.onToggle} edge="end">
                    <Iconify
                      icon={
                        password.value
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Link
            variant="body2"
            color="inherit"
            underline="always"
            sx={{ alignSelf: 'flex-end' }}
            href="/"
          >
            Forgot password?
          </Link>

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>

          <Divider>
            <Typography variant="body2" color="text.disabled">
              OR
            </Typography>
          </Divider>
          <Stack
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            {/* Logos have been pulled using Iconfy, auth provider will be connected, onClick envent will be used */}
            <IconButton>
              <Iconify width={24} icon="flat-color-icons:google" />
            </IconButton>
            <IconButton>
              <Iconify width={30} color="#1877f2" icon="ei:sc-facebook" />
            </IconButton>
            <IconButton>
              <Iconify width={24} color="#00AAEC" icon="logos:twitter" />
            </IconButton>
          </Stack>
        </Stack>
      </FormProvider>
    </>
  );
}
