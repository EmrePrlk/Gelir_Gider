'use client';

import { type IUserCertificate } from 'src/types/user';

import AccountTextSection from './account-text-section';

export type CertificateCardProps = {
  certificates?: IUserCertificate[];
};

export default function AccountCertificates({
  certificates,
}: CertificateCardProps) {
  if (!certificates) return null;

  const formattedCertificates = certificates.map(certificate => ({
    id: certificate.id.toString(),
    title: certificate.name,
    text: ` ${certificate.expiration_date} | ${certificate.detail}`,
  }));

  return (
    <AccountTextSection
      data={formattedCertificates || []}
      title="Certificates"
    />
  );
}
