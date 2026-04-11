import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Tooltip, IconButton, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { AlertError } from 'src/components/form-error';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useManageAccountSecurityPasswordForm } from '../_hooks/use-manage-account-security-password-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const password = useBoolean();

  const { methods, isSubmitting, onSubmit, errorMsg } =
    useManageAccountSecurityPasswordForm();

  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <AlertError error={errorMsg} />

        <Stack spacing={3}>
          <RHFTextField
            name="oldPassword"
            type={password.value ? 'text' : 'password'}
            label="Old Password"
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

          <RHFTextField
            name="newPassword"
            label="New Password"
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
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} />{' '}
                Password must be minimum 6+
              </Stack>
            }
          />

          <RHFTextField
            name="confirmNewPassword"
            type={password.value ? 'text' : 'password'}
            label="Confirm New Password"
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Still in development">
              <span>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled
                  // sx={{ ml: 'auto' }}
                >
                  Save Changes
                </LoadingButton>
              </span>
            </Tooltip>
          </Box>
        </Stack>
      </FormProvider>
    </>
  );
}
