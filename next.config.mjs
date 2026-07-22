/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_HOSTS 
    ? process.env.ALLOWED_DEV_HOSTS.split(',') 
    : ['localhost'],
    
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
