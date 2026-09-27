import type { NextConfig } from 'next';

const config: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BUILD_ID: (process.env.VERCEL_GIT_COMMIT_SHA || process.env.APP_BUILD_ID || 'local').slice(0, 12),
    NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV || 'local',
  },
};
export default config;
