'use client';

import RouterLink from 'next/link';

import { Stack, Button } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { paths } from 'src/config/paths';
import { ProjectStatus } from 'src/definitions/project-status';
import { useIdeaDelete } from 'src/app/(app)/dashboard/ideas/_views/idea-view/_hooks/use-idea-delete';
import { useIdeaMakeProject } from 'src/app/(app)/dashboard/ideas/_views/idea-view/_hooks/use-idea-make-project';

import Iconify from 'src/components/iconify';

import { type IIdeaDetail, type IIdeaToProjectRequest } from 'src/types/idea';

import IdeaCustomDialog from './idea-custom-dialog';

interface IdeaDetailHeaderActionsProps {
  ideaDetail: IIdeaDetail;
}

export default function IdeaDetailHeaderActions({
  ideaDetail,
}: IdeaDetailHeaderActionsProps) {
  const dialogProject = useBoolean();
  const dialogDelete = useBoolean();

  const { mutate: deleteIdeaMutation, isLoading: isDeleteLoading } =
    useIdeaDelete({
      ideaId: ideaDetail.id,
    });

  const { mutate: makeProjectMutation, isLoading: isProjectLoading } =
    useIdeaMakeProject({
      ideaId: ideaDetail.id,
    });

  const handleDeleteConfirm = () => {
    deleteIdeaMutation();
  };

  const handleProjectConfirm = () => {
    const projectRequest: IIdeaToProjectRequest = {
      idea_id: ideaDetail.id,
      title: ideaDetail.title,
      summary: ideaDetail.summary,
      detail: ideaDetail.detail,
      status: ProjectStatus.Draft,
      category: ideaDetail.category,
    };
    makeProjectMutation(projectRequest);
  };

  return (
    <Stack
      spacing={1}
      flexWrap="wrap"
      sx={{
        mb: { xs: 2, md: 0 },
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      {/* EDIT IDEA */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 2, justifyContent: 'flex-start !important' }}
        component={RouterLink}
        href={paths.dashboard.ideas.edit(ideaDetail.id.toString())}
        startIcon={<Iconify icon="eva:edit-outline" width={24} height={24} />}
      >
        Edit Idea
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={dialogDelete.onTrue}
        sx={{ mr: 2 }}
        startIcon={
          <Iconify icon="eva:trash-2-outline" width={24} height={24} />
        }
      >
        Delete Idea
      </Button>

      <Button
        variant="contained"
        onClick={dialogProject.onTrue}
        startIcon={
          <Iconify icon="eva:file-text-outline" width={24} height={24} />
        }
      >
        Make Project
      </Button>

      <IdeaCustomDialog
        title="Delete Idea"
        content="Are you sure you want to delete this idea? This action cannot be undone."
        ideaTitle={ideaDetail.title}
        open={dialogDelete.value}
        onClose={dialogDelete.onFalse}
        onConfirm={handleDeleteConfirm}
        confirmButtonText="Delete"
        confirmButtonColor="error"
        icon="eva:trash-2-outline"
        isLoading={isDeleteLoading}
      />

      <IdeaCustomDialog
        title="Convert Idea to Project"
        content="Are you sure you want to convert this idea to a project?"
        ideaTitle={ideaDetail.title}
        open={dialogProject.value}
        onClose={dialogProject.onFalse}
        onConfirm={handleProjectConfirm}
        confirmButtonText="Convert"
        confirmButtonColor="primary"
        icon="eva:checkmark-circle-2-fill"
        isLoading={isProjectLoading}
      />
    </Stack>
  );
}
