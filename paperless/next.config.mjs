/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jftlerdywqsgjfrkeizk.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", //  allows any image in public buckets
      },
    ],
  },
};

export default nextConfig;
