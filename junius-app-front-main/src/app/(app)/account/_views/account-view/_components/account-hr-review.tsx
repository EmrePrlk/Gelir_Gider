'use client';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Button, CardHeader } from '@mui/material';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

import { type IUserNote } from 'src/types/user';

import AccountTextSection from './account-text-section';
import { useAccountHRForm } from '../_hooks/use-account-hr-form';

export type AccountHRReviewProps = {
  hrOpinions: IUserNote[];
};

// TODO: Add options for edit and delete
export default function AccountHRReview({ hrOpinions }: AccountHRReviewProps) {
  const {
    edit,
    methods,
    onSubmit,
    handleEditClick,
    handleCancelClick,
    formattedOpinions,
    loading,
  } = useAccountHRForm(hrOpinions);

  return (
    <Card sx={{ minHeight: '6.25rem' }}>
      <CardHeader
        title="HR Opinion"
        action={
          !edit.value && (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:pen-bold" />}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )
        }
      />
      <Box sx={{ p: edit.value ? 4 : 0 }}>
        {edit.value ? (
          <FormProvider methods={methods} onSubmit={onSubmit}>
            <RHFTextField
              name="note_detail"
              label="HR Opinion"
              multiline
              rows={4}
              sx={{ marginBottom: '16px' }}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <LoadingButton
                variant="contained"
                type="submit"
                loading={loading}
              >
                Save
              </LoadingButton>
              <Button
                startIcon={<Iconify icon="solar:cancel-bold" />}
                variant="outlined"
                color="error"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </Stack>
          </FormProvider>
        ) : (
          <AccountTextSection data={formattedOpinions} title="" disableCard />
        )}
      </Box>
    </Card>
  );
}
