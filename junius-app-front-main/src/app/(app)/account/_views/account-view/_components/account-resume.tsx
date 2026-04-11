import RouterLink from 'next/link';

import {
  Card,
  Stack,
  Button,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import FileThumbnail from 'src/components/file-thumbnail';
import { fileData } from 'src/components/file-thumbnail/utils';

import { useManagedUser } from '../../../_context/use-managed-user';

export default function AccountResume() {
  const { user } = useManagedUser();

  if (!user?.cv_link) return null;

  const file = fileData(user?.cv_link as string);

  return (
    <Card>
      <CardHeader title="Resume" />
      <CardContent>
        <Button
          component={RouterLink}
          href={user?.cv_link as string}
          target="_blank"
          variant="text"
          color="inherit"
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={file.type} sx={{ width: 36, height: 36 }} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 360,
                cursor: 'pointer',
              }}
            >
              {file.name}
            </Typography>
          </Stack>
        </Button>
      </CardContent>
    </Card>
  );
}
