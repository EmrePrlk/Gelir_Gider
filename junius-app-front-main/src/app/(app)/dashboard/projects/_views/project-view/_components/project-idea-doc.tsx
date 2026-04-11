import RouterLink from 'next/link';

import {
  Card,
  Stack,
  Button,
  CardHeader,
  Typography,
  CardContent,
} from '@mui/material';

import { useProjectStore } from 'src/stores/project-list-store';

import FileThumbnail from 'src/components/file-thumbnail';
import { fileData } from 'src/components/file-thumbnail/utils';

export default function ProjectIdeaDoc() {
  const [project] = useProjectStore(state => [state.project]);

  if (!project?.idea?.document_link) return null;

  const file = fileData(project?.idea?.document_link);

  return (
    <Card>
      <CardHeader title="Project Idea Document" />
      <CardContent>
        <Button
          component={RouterLink}
          href={project?.idea?.document_link}
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
