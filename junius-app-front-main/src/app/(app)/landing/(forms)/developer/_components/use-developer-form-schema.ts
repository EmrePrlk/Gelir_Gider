import * as Yup from 'yup';
import { useMemo } from 'react';

import { githubRegex, linkedinRegex } from 'src/utils/regex';

import { MAX_FILE_SIZE } from 'src/config/constants';
import { useDefinitionStore } from 'src/stores/definition-store';

export const useDeveloperFormSchema = () => {
  const [preferedTitles] = useDefinitionStore(state => [state.preferedTitles]);

  const developerFormSchema = useMemo(
    () => ({
      linkedin_link: Yup.string()
        .matches(linkedinRegex, 'https://www.linkedin.com/in/username')
        .required('LinkedIn URL is required'),
      github_link: Yup.string()
        .matches(githubRegex, 'https://github.com/username')
        .required('GitHub URL is required'),
      cv_link: Yup.mixed()
        .test('fileType', 'Only PDF files are allowed', value => {
          if (value && value instanceof File) {
            return value.type === 'application/pdf';
          }
          return true;
        })
        .test('fileSize', 'File size must be less than 5MB', value => {
          if (value && value instanceof File) {
            return value.size <= MAX_FILE_SIZE;
          }
          return true;
        })
        .test(
          'fileCount',
          'Only one file is allowed',
          value => !value || value instanceof File,
        )
        .required('CV file is required'),
      prefered_title: Yup.string()
        .required('Title is required')
        .oneOf(
          preferedTitles.map(title => title.id),
          'Invalid title',
        ),
    }),
    [preferedTitles],
  );

  const developerFormDefaultValues = useMemo(
    () => ({
      linkedin_link: '',
      github_link: '',
      cv_link: null,
      prefered_title: '',
    }),
    [],
  );

  return { developerFormSchema, developerFormDefaultValues };
};
