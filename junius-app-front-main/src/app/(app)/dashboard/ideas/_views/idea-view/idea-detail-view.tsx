'use client';

import { useQuery } from '@tanstack/react-query';

import { Box, Container } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import Can from 'src/lib/casl/can';
import { getIdeaWithUser } from 'src/services/idea';
import { BASE_QUERY_TAG } from 'src/config/constants';
import UserContactCard from 'src/app/(app)/_components/user-contact-card';

import SplashWrapper from 'src/components/loading-screen/splash-wrapper';

import IdeaDetailCard from './_components/idea-detail-card';
import IdeaDetailHeader from './_components/idea-detail-header';
import IdeaDetailHeaderActions from './_components/idea-detail-header-actions';

interface IdeaDetailViewProps {
  id: number;
}

export default function IdeaDetailView({ id }: IdeaDetailViewProps) {
  const { data: ideaDetail, isLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: () => getIdeaWithUser(id),
    meta: {
      tags: [BASE_QUERY_TAG],
    },
  });

  const CARDS = [
    {
      title: 'Idea Title',
      content: ideaDetail?.title,
    },
    {
      title: 'Short Description',
      content: ideaDetail?.summary,
    },
    {
      title: 'Target Investment',
      content: `${ideaDetail?.target_investment ? fCurrency(ideaDetail.target_investment) : 'N/A'}`,
    },
    {
      title: 'Possible Competitors',
      content: ideaDetail?.possible_competitor,
    },
    {
      title: 'Detailed Description',
      content: ideaDetail?.detail.toString() ?? 'N/A',
      richContent: !!ideaDetail?.detail,
    },
  ];

  return (
    <SplashWrapper isLoading={isLoading || !ideaDetail}>
      <Container>
        <IdeaDetailHeader title="Idea Details">
          <Can I="update" a="idea">
            <IdeaDetailHeaderActions ideaDetail={ideaDetail!} />
          </Can>
        </IdeaDetailHeader>
        <UserContactCard user={ideaDetail?.user} sx={{ mb: 3 }} />
        <Box gap={1} display="flex" flexDirection="column">
          {CARDS.map(card => (
            <IdeaDetailCard
              key={card.title}
              title={card.title}
              content={card.content ?? 'N/A'}
              richContent={card.richContent}
            />
          ))}
        </Box>
      </Container>
    </SplashWrapper>
  );
}
