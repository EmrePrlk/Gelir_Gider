import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from '../iconify';
import { type UploadProps } from './types';
import MultiFilePreview from './preview-multi-file';
import RejectionFiles from './errors-rejection-files';
import SingleFilePreview from './preview-single-file';

// ----------------------------------------------------------------------

export default function UploadBoxRegister({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onRemove,
  sx,
  ...other
}: UploadProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,
    maxFiles: 2,
    accept: {
      'application/pdf': ['.pdf'],
      'application/docx': ['.docx', '.doc'],
    },
    maxSize: 5_000_000,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasMaxFile = !!files && files.length < 5;

  const hasFiles = !!files && multiple && files.length > 0;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack
      spacing={1}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      sx={{
        color: '#919EAB',
      }}
    >
      <Iconify icon="eva:cloud-upload-fill" width={48} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="body2">Upload file</Typography>
        <Typography variant="caption" sx={{ fontSize: '10px' }}>
          Max 5mb & Max 5 Files
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview
      imgUrl={typeof file === 'string' ? file : file?.preview}
    />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: theme => alpha(theme.palette.common.white, 0.8),
        bgcolor: theme => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: theme => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = hasFiles && (
    <Box sx={{ mt: 3, mb: 1 }}>
      <MultiFilePreview
        files={files}
        thumbnail={thumbnail}
        onRemove={onRemove}
      />
    </Box>
  );

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: hasMaxFile ? 'pointer' : 'not-allowed',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: theme => alpha(theme.palette.grey[500], 0.08),
          border: theme => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: theme => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: theme => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile && hasMaxFile ? renderSinglePreview : renderPlaceholder}
      </Box>
      {removeSinglePreview}

      {helperText && helperText}
      {!hasMaxFile && (
        <div style={{ fontSize: '14px', textAlign: 'center' }}>
          * You can only upload a total of 5 files.
        </div>
      )}
      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}
