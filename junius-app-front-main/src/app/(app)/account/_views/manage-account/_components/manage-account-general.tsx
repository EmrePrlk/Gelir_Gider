import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, Stack, CardHeader, Typography } from '@mui/material';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';
import { MAX_FILE_SIZE } from 'src/config/constants';

import { AlertError } from 'src/components/form-error';
import FormProvider, {
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { useManageAccountGeneralForm } from '../_hooks/use-manage-account-general-form';

export default function ManageAccountGeneral() {
  const { methods, isSubmitting, onSubmit, handleDrop, errorMsg } =
    useManageAccountGeneralForm();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <AlertError error={errorMsg} />

          <Card sx={{ pb: 5, px: 3, textAlign: 'center' }}>
            <CardHeader title="Profile Picture" />
            <RHFUploadAvatar
              name="profile_picture"
              maxSize={MAX_FILE_SIZE}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png
                  <br /> max size of {fData(MAX_FILE_SIZE)}
                </Typography>
              }
              // TODO: You can upload file via clicking the avatar, but also add a button to upload file, for better UX.
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <Card sx={{ p: 3, pt: 0 }}>
            <CardHeader title="Personal Information" sx={{ mb: 3, pl: 0 }} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField name="phone_number" label="Phone Number" />

              <RHFAutocomplete
                name="country"
                type="country"
                label="Country"
                placeholder="Choose a country"
                options={countries.map(option => option.label)}
                getOptionLabel={option => option}
              />
              <RHFTextField name="state_region" label="State/Region" />

              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />

              <RHFTextField name="zip_code" label="Zip/Code" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField
                name="about_me"
                multiline
                rows={4}
                label="About me"
              />

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
