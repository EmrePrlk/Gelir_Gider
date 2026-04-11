import * as Yup from 'yup';

import { MAX_FILE_SIZE } from 'src/config/constants';

export const ideatorFormSchema = {
  title_project: Yup.string().required('Title is required').max(150),
  description_project: Yup.string()
    .required('Description is required')
    .max(2048),
  competitors_project: Yup.string()
    .required('Competitors is required')
    .max(400),
  documents_project: Yup.array()
    .of(
      Yup.mixed().test('fileSize', 'Each file must be less than 5MB', value => {
        if (value && value instanceof File) {
          return value.size <= MAX_FILE_SIZE; // 5MB in bytes
        }
        return true;
      }),
    )
    .max(5, 'Maximum of 5 files allowed')
    .nullable(),
} as const;

export const ideatorFormDefaultValues = {
  title_project: '',
  description_project: '',
  competitors_project: '',
  documents_project: [],
};
