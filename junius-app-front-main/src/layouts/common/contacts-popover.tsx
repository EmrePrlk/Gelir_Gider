import { useState } from 'react';
import { m } from 'framer-motion';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fToNow } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type ContactStatus = 'online' | 'offline' | 'alway' | 'busy';

type Contact = {
  id: string; // assuming _mock.id() returns a string
  status: ContactStatus; // status will be one of 'online', 'offline', 'alway', 'busy'
  role: string; // assuming _mock.role() returns a string
  email: string; // assuming _mock.email() returns a string
  name: string; // assuming _mock.fullName() returns a string
  phoneNumber: string; // assuming _mock.phoneNumber() returns a string
  lastActivity: string; // assuming _mock.time() returns a string
  avatarUrl: string; // assuming _mock.image.avatar() returns a string
  address: string; // assuming _mock.fullAddress() returns a string
};

export default function ContactsPopover() {
  const popover = usePopover();
  const [contacts, _] = useState<Contact[]>([]);

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={popover.open ? 'inherit' : 'default'}
        onClick={popover.onOpen}
        sx={{
          ...(popover.open && {
            bgcolor: theme => theme.palette.action.selected,
          }),
        }}
      >
        <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 320 }}
      >
        <Typography variant="h6" sx={{ p: 1.5 }}>
          Contacts <Typography component="span">({contacts.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: 320 }}>
          {contacts.map(contact => (
            <MenuItem key={contact.id} sx={{ p: 1 }}>
              <Badge
                variant={
                  contact.status as 'alway' | 'online' | 'busy' | 'offline'
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{ mr: 2 }}
              >
                <Avatar alt={contact.name} src={contact.avatarUrl} />
              </Badge>

              <ListItemText
                primary={contact.name}
                secondary={
                  contact.status === 'offline'
                    ? fToNow(contact.lastActivity)
                    : ''
                }
                primaryTypographyProps={{ typography: 'subtitle2' }}
                secondaryTypographyProps={{
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            </MenuItem>
          ))}
        </Scrollbar>
      </CustomPopover>
    </>
  );
}
