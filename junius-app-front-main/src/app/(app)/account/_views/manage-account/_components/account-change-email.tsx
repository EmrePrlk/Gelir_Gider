import { Button, Tooltip, Typography, InputAdornment } from '@mui/material';

import { AlertError } from 'src/components/form-error';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useManageAccountSecurityEmailForm } from '../_hooks/use-manage-account-security-email-form';
// ----------------------------------------------------------------------

export default function AccountChangeEmail() {
  const { methods, isSubmitting, onSubmit, errorMsg } =
    useManageAccountSecurityEmailForm();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <AlertError error={errorMsg} />
      <Typography variant="body1" sx={{ mb: 2 }}>
        Enter your new email address below to receive a verification code.
      </Typography>
      <RHFTextField
        sx={{ mb: 4 }}
        name="newEmail"
        label="Enter New E-mail Adress"
        disabled={isSubmitting}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Still in development">
                <span>
                  <Button
                    type="submit"
                    disabled
                    sx={{
                      border: 1,
                      borderColor: '#919EAB52',
                      color: 'text.primary',
                    }}
                  >
                    Send Code
                  </Button>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </FormProvider>
  );
}
