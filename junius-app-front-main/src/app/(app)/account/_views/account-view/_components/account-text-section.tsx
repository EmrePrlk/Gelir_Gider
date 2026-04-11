'use client';

import {
  Box,
  Card,
  List,
  ListItem,
  CardHeader,
  CardContent,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

import Iconify from 'src/components/iconify';

interface IAccountTextSection {
  id: string;
  title: string;
  text: string;
}

interface AccountTextSectionProps {
  data: IAccountTextSection[];
  title: string;
  disableCard?: boolean;
}

export default function AccountTextSection({
  data,
  title,
  disableCard = false,
}: AccountTextSectionProps) {
  if (data.length === 0) return null;

  const Content = (
    <>
      {title && <CardHeader title={title} />}
      <CardContent>
        <List disablePadding>
          {data.map((result, index) => (
            <Box key={result.id} mb={index < data.length - 1 ? 2 : 0}>
              <ListItem sx={{ p: 0 }} disablePadding={false}>
                <ListItemIcon>
                  <Iconify icon="octicon:dot-fill-16" color="default" />
                </ListItemIcon>
                <ListItemText
                  primary={result.title}
                  primaryTypographyProps={{
                    typography: 'subtitle1',
                    gutterBottom: true,
                  }}
                  secondary={result.text}
                  secondaryTypographyProps={{
                    typography: 'body2',
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </CardContent>
    </>
  );

  return disableCard ? Content : <Card>{Content}</Card>;
}
