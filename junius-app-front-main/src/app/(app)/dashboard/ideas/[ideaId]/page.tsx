import IdeaDetailView from '../_views/idea-view/idea-detail-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Ideas: Idea Detail',
};

export default function IdeaDetailPage({
  params,
}: {
  params: { ideaId: string };
}) {
  return <IdeaDetailView id={Number(params.ideaId)} />;
}
