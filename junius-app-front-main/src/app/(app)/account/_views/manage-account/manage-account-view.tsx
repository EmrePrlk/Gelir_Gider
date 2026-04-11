'use client';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import Iconify from 'src/components/iconify';

import ManageAccountCareer from './_components/manage-account-career';
import ManageAccountSocial from './_components/manage-account-social';
import AccountBreadcrumbs from '../../_components/account-breadcrumbs';
import ManageAccountGeneral from './_components/manage-account-general';
import ManageAccountSecurity from './_components/manage-account-security';

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'career',
    label: 'Career',
    icon: (
      <Iconify icon="material-symbols:label-important-rounded" width={24} />
    ),
    disabled: true,
  },
  {
    value: 'social',
    label: 'Social links',
    icon: <Iconify icon="solar:share-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Security',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

export default function ManageAccountView() {
  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    [],
  );

  return (
    <Container>
      <AccountBreadcrumbs />

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map(tab => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
            disabled={tab.disabled}
          />
        ))}
      </Tabs>

      {currentTab === 'general' && <ManageAccountGeneral />}

      {currentTab === 'career' && <ManageAccountCareer />}

      {currentTab === 'social' && <ManageAccountSocial />}

      {currentTab === 'security' && <ManageAccountSecurity />}
    </Container>
  );
}
