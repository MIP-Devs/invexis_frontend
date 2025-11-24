import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
    ],
  },
  // Development proxy: forward local `/api/*` requests to the real backend
  // Restart dev server after changing envs for this to take effect.
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_INVENTORY_API_URL;
    if (!backend) return [];
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
