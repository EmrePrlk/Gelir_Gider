import createJiti from 'jiti';
const jiti = createJiti(new URL(import.meta.url).pathname);

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti('./src/env');

export const trailingSlash = true;
export const modularizeImports = {
  '@mui/icons-material': {
    transform: '@mui/icons-material/{{member}}',
  },
  '@mui/material': {
    transform: '@mui/material/{{member}}',
  },
  '@mui/lab': {
    transform: '@mui/lab/{{member}}',
  },
};
export function webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });
  return config;
}

export default {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
