import * as Yup from 'yup';

import { linkedinRegex } from 'src/utils/regex';

import { Industry, InvestmentAmount } from 'src/definitions';

export const investorFormSchema = {
  interested_areas: Yup.string()
    .required('Interested Areas is required')
    .oneOf(Object.values(Industry), 'Invalid industry'),
  investment_amount: Yup.string()
    .required('Investment Amount is required')
    .oneOf(Object.values(InvestmentAmount), 'Invalid investment amount'),
  linkedin_link: Yup.string()
    .matches(linkedinRegex, 'https://www.linkedin.com/in/username')
    .required('LinkedIn URL is required'),
  about_me: Yup.string()
    .required('Tell us about you section is required')
    .max(300),
} as const;

export const investorFormDefaultValues = {
  interested_areas: '',
  position_investment: '',
  linkedin_link: '',
  about_me: '',
};
