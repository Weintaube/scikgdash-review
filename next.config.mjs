/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
      MATOMO_API_URL: process.env.MATOMO_API_URL,
      MATOMO_API_KEY: process.env.MATOMO_API_KEY,
    },
  basePath: process.env.BASE_PATH||'',
  };
  
  export default nextConfig;
  