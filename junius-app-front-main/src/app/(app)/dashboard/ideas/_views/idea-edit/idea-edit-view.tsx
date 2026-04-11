'use client';

import { Container } from '@mui/system';

import IdeaManageView from 'src/app/(app)/dashboard/ideas/_components/idea-manage-view';
import IdeaBreadcrumbs from 'src/app/(app)/dashboard/ideas/_components/idea-breadcrumbs';

export default function IdeaEditView({ ideaId }: { ideaId: number }) {
  return (
    <Container>
      <IdeaBreadcrumbs title="Edit Idea" />

      <IdeaManageView ideaId={ideaId} />
    </Container>
  );
}
