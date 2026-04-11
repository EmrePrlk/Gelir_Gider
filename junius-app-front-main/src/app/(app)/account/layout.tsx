import SimpleLayout from 'src/layouts/simple/simple-layout';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimpleLayout>{children}</SimpleLayout>;
}
