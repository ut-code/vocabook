// next.config.ts
import path from "node:path";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: {
      mdxType: "gfm", // 'gfm' | 'commonmark'
    },
    serverActions: {
      // Excelファイルのアップロードに対応するため、デフォルト(1MB)より広げる
      bodySizeLimit: "10mb",
    },
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

const withMDX = createMDX({
  // remark/rehype プラグインはここで指定
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
