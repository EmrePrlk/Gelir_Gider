/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------
import dynamic from 'next/dynamic';

import ThemeProvider from 'src/theme';
import { LocalizationProvider } from 'src/locales';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsProvider } from 'src/components/settings';

import { QueryProvider } from 'src/providers';

const AbilityProvider = dynamic(
  () =>
    import('src/lib/casl/ability-provider').then(mod => mod.AbilityProvider),
  { ssr: false },
);

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: 'Junius App',
  description:
    'An innovative collaborative platform connecting developers, project ideas, and investors to catalyze the transformation of innovative ideas into successful realities.',
  keywords:
    'collaboration,developers,investors,projects,ideas,ventures,yc,success,innovation,startup,funding,entrepreneurship,technology,networking,business,growth,partnership,incubator,accelerator,ecosystem',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <QueryProvider>
          <LocalizationProvider>
            <SettingsProvider
              defaultSettings={{
                themeMode: 'light', // 'light' | 'dark'
                themeDirection: 'ltr', //  'rtl' | 'ltr'
                themeContrast: 'default', // 'default' | 'bold'
                themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                themeStretch: false,
              }}
            >
              <ThemeProvider>
                <MotionLazy>
                  <SnackbarProvider>
                    <ProgressBar />
                    <AbilityProvider>{children}</AbilityProvider>
                  </SnackbarProvider>
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </LocalizationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
