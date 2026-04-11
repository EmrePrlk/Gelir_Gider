/* eslint-disable react/no-children-prop */
'use client';

import { Card, CardHeader, Typography, CardContent } from '@mui/material';

import Markdown from 'src/components/markdown';

type IdeaDetailCardProps = {
  title: string;
  content: string | number;
  richContent?: boolean;
};

export default function IdeaDetailCard({
  title,
  content,
  richContent = false,
}: IdeaDetailCardProps) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={title} />
      <CardContent>
        {richContent ? (
          <Markdown children={content as string} />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {content}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
