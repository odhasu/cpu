const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'export',
  trailingSlash: true,
  devIndicators: false,
  agentRules: false,
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
