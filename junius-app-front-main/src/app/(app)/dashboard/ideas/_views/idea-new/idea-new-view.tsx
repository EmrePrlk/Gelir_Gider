'use client';

import { Container } from '@mui/system';

import WelcomeBar from 'src/app/(app)/_components/welcome-bar';
import { MotivationIllustration } from 'src/assets/illustrations';
import IdeaManageView from 'src/app/(app)/dashboard/ideas/_components/idea-manage-view';
import IdeaBreadcrumbs from 'src/app/(app)/dashboard/ideas/_components/idea-breadcrumbs';

export default function IdeaNewView() {
  return (
    <Container>
      <IdeaBreadcrumbs title="New Idea" />
      <WelcomeBar
        title="Innovate, Create, Elevate"
        description="Welcome to your innovation hub! This is where groundbreaking ideas take flight. Browse through your existing concepts, spark new innovations, and watch as your entrepreneurial vision comes to life. Remember, every world-changing idea starts with a single thought – and this is where you nurture those thoughts into reality."
        textMaxWidth={600}
      >
        <MotivationIllustration />
      </WelcomeBar>

      <IdeaManageView />
    </Container>
  );
}
