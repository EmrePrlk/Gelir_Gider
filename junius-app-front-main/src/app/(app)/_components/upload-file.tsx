import { Controller } from 'react-hook-form';

import { Stack, Typography } from '@mui/material';

import { useFile } from 'src/hooks/use-file';

import { fData } from 'src/utils/format-number';

import { MAX_FILE_SIZE } from 'src/config/constants';

import { Upload } from 'src/components/upload';

interface UploadFileProps {
  name: string;
  label: string;
  helperText: string;
  isSubmitting: boolean;
  multiple?: boolean;
  maxCount?: number;
  accept: Record<string, string[]>;
}

export default function UploadFile({
  name,
  label,
  helperText,
  isSubmitting,
  multiple = false,
  maxCount = 1,
  accept,
}: UploadFileProps) {
  const { files, handleDropFile, handleRemoveFile, handleClearFiles } =
    useFile(multiple);
  return (
    <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h6">{label}</Typography>
        <Controller
          name={name}
          render={({ fieldState, field: { onChange } }) => (
            <>
              {fieldState.error?.message && (
                <Typography variant="body2" color="error">
                  {fieldState.error?.message}
                </Typography>
              )}
              <Upload
                onDrop={acceptedFiles => {
                  onChange(handleDropFile(acceptedFiles));
                }}
                onRemove={removedFile => {
                  onChange(handleRemoveFile(removedFile));
                }}
                onDelete={() => {
                  onChange(handleClearFiles());
                }}
                files={files}
                multiple // Should be true in any condition
                accept={accept}
                maxSize={MAX_FILE_SIZE} // 5 MB
                disabled={isSubmitting}
                error={!!fieldState.error}
                maxFiles={maxCount}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    {helperText}
                    <br /> max size of {fData(MAX_FILE_SIZE)}
                    <br />
                    {files.length} / {maxCount} files
                  </Typography>
                }
              />
            </>
          )}
        />
      </Stack>
    </>
  );
}
