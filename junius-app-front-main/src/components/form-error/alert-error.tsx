import { Alert } from '@mui/material';

export default function AlertError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <Alert severity="error" sx={{ mb: 3 }}>
      {error}
    </Alert>
  );
}
