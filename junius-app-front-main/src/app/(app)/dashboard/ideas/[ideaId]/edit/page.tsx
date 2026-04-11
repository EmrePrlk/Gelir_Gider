import IdeaEditView from 'src/app/(app)/dashboard/ideas/_views/idea-edit/idea-edit-view';

export const metadata = {
  title: 'Edit Idea | Junius App',
};

export default function IdeaEditPage({
  params,
}: {
  params: { ideaId: number };
}) {
  return <IdeaEditView ideaId={params.ideaId} />;
}
