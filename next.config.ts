import type { NextConfig } from "next"; // Last updated: 2026-01-08 15:30 (Force restart)
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
