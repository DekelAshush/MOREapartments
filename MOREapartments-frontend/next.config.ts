import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75],
    localPatterns: [
      { pathname: "/logo.png" },
      { pathname: "/logo-header-icon.png" },
    ],
  },
};

export default withNextIntl(nextConfig);
