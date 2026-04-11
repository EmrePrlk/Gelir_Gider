import * as Yup from 'yup';

export const passwordValidator = Yup.string()
  .min(8)
  .matches(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!$%&*.?@])[\d!$%&*.?@A-Za-z]{8,}$/,
    'Password must be at least 8 characters, 1 number, 1 special character',
  );
