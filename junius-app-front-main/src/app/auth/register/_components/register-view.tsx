'use client';

import RegisterForm from './register-form';
import RegisterHead from './register-head';
import RegisterTerms from './register-terms';

export default function RegisterView() {
  return (
    <>
      <RegisterHead />
      <RegisterForm />
      <RegisterTerms />
    </>
  );
}
