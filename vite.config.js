import { createHash } from "node:crypto";
import { defineConfig } from "vite";

// Content-Security-Policy for the built page (GitHub Pages sets no headers, so it goes in a meta
// tag). Everything is self-hosted; the one inline script, the loader's language, is allowed by its
// hash. Build only: the dev server injects its own client and HMR socket.
const csp = {
  name: "csp",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler(html) {
      const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
        ([, js]) => `'sha256-${createHash("sha256").update(js).digest("base64")}'`
      );
      const policy = [
        "default-src 'self'",
        `script-src 'self' ${hashes.join(" ")}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "media-src 'self' data: blob:",
        "connect-src 'self' data: blob:",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ].join("; ");
      return html.replace(
        "<head>",
        `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />\n    <meta name="referrer" content="no-referrer" />`
      );
    },
  },
};

export default defineConfig({
  base: "/the-book-of-magical-tales/",
  plugins: [csp],
  build: {
    // three.js alone is ~610 kB minified (its renderer and shader library do not tree-shake further)
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // three.js in a chunk of its own: a new version of the book leaves it cached
        manualChunks: (id) => (id.includes("/node_modules/three/") && !id.includes("/examples/") ? "three" : undefined),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  },
  preview: {
    host: "127.0.0.1",
    port: 4173
  }
});
