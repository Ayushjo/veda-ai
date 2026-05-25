/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        'html2pdf.js',
        'html2canvas',
        'dom-to-image-more',
        'jspdf',
      ];
    }
    return config;
  },
};

export default nextConfig;
