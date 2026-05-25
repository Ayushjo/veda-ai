/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'html2pdf.js',
        'jspdf',
        'html2canvas',
      ];
    }
    return config;
  },
};

export default nextConfig;
