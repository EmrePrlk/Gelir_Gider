import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Stack, Typography, InputAdornment } from '@mui/material';

import Iconify from 'src/components/iconify';
import { AlertError } from 'src/components/form-error';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { type IUserSocialLink } from 'src/types/user';

import useManageAccountSocialForm from '../_hooks/use-manage-account-social-form';

// ----------------------------------------------------------------------

export default function ManageAccountSocialLinks() {
  const { methods, isSubmitting, onSubmit, errorMsg, socialLinks } =
    useManageAccountSocialForm();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack component={Card} spacing={3} sx={{ p: 3 }}>
        <AlertError error={errorMsg} />

        <Typography variant="h6">Social Links</Typography>
        {Object.keys(socialLinks).map(link => {
          const { icon, color, title, placeholder } = getSocialMediaInfo(
            link as keyof IUserSocialLink,
          );
          return (
            <RHFTextField
              key={link}
              name={link}
              label={title}
              placeholder={placeholder}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify width={24} icon={icon} color={color} />
                  </InputAdornment>
                ),
              }}
            />
          );
        })}

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ ml: 'auto' }}
        >
          Save Changes
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

function getSocialMediaInfo(linkType: keyof IUserSocialLink) {
  const socialMediaInfo = {
    facebook_link: {
      icon: 'line-md:facebook',
      color: '#1877F2',
      title: 'Facebook',
      placeholder: 'https://facebook.com/username',
    },
    instagram_link: {
      icon: 'line-md:instagram',
      color: '#DF3E30',
      title: 'Instagram',
      placeholder: 'https://instagram.com/username',
    },
    linkedin_link: {
      icon: 'line-md:linkedin',
      color: '#006097',
      title: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/username',
    },
    twitter_link: {
      icon: 'line-md:twitter-x',
      color: '#1C9CEA',
      title: 'X',
      placeholder: 'https://x.com/username',
    },
    github_link: {
      icon: 'line-md:github',
      color: '#181717',
      title: 'GitHub',
      placeholder: 'https://github.com/username',
    },
  };

  return (
    socialMediaInfo[linkType] || {
      icon: '',
      color: '',
      title: 'Unknown',
      placeholder: 'https://',
    }
  );
}
