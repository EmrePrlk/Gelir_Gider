'use client';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import { AlertError } from 'src/components/form-error';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import useRegisterForm from '../_hooks/use-register-form';

export default function RegisterForm() {
  const {
    errorMsg,
    methods,
    onSubmit,
    isSubmitting,
    password,
    passwordConfirmation,
  } = useRegisterForm();

  return (
    <>
      <AlertError error={errorMsg} />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <RHFTextField name="first_name" label="First name" />
            <RHFTextField name="last_name" label="Last name" />
          </Stack>

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
          <RHFTextField
            name="password_confirmation"
            label="Password Confirmation"
            type={passwordConfirmation.value ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={passwordConfirmation.onToggle}
                    edge="end"
                  >
                    <Iconify
                      icon={
                        passwordConfirmation.value
                          ? 'solar:eye-bold'
                          : 'solar:eye-closed-bold'
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Create account
          </LoadingButton>
        </Stack>
      </FormProvider>
    </>
  );
}
