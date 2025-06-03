import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    config.resolve.extensions.push(".wasm");

    return config;
  },
};

export default nextConfig;
